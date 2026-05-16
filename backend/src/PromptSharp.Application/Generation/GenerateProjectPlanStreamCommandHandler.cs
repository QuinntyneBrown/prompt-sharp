using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using FluentValidation;
using MediatR;
using PromptSharp.Application.Abstractions;
using PromptSharp.Application.Common;
using PromptSharp.Application.Mappings;
using PromptSharp.Application.Projects;
using PromptSharp.Application.Rendering;
using PromptSharp.Domain.Entities;
using PromptSharp.Domain.Enums;

namespace PromptSharp.Application.Generation;

public sealed class GenerateProjectPlanStreamCommandHandler(
    IPromptSharpDbContext dbContext,
    ICurrentUser currentUser,
    IDateTimeProvider dateTimeProvider,
    IAgentSkillCatalog skillCatalog,
    IAiPromptPlanner aiPromptPlanner,
    IAzureDeploymentNameProvider azureDeploymentNameProvider,
    ProjectMarkdownRenderer markdownRenderer,
    IValidator<GeneratedProjectPlan> planValidator) : IStreamRequestHandler<GenerateProjectPlanStreamCommand, ProjectGenerationUpdateDto>
{
    public async IAsyncEnumerable<ProjectGenerationUpdateDto> Handle(
        GenerateProjectPlanStreamCommand request,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var project = await ProjectQuery.LoadOwnedProjectAsync(
            dbContext,
            request.UserId ?? currentUser.RequireUserId(),
            request.ProjectNumber,
            true,
            cancellationToken);

        if (project.GenerationStatus == GenerationStatus.Succeeded)
        {
            yield return new ProjectGenerationUpdateDto(
                "completed",
                "Prompt pack is already generated.",
                null,
                null,
                null,
                project.ToDto(dateTimeProvider.UtcNow));
            yield break;
        }

        var nowUtc = dateTimeProvider.UtcNow;
        project.MarkRunning(nowUtc);
        await dbContext.SaveChangesAsync(cancellationToken);

        yield return new ProjectGenerationUpdateDto("started", "Starting project generation.", null, null, null, null);

        var skillBundleResult = await TryLoadSkillBundleAsync(cancellationToken);
        if (skillBundleResult.Failure is not null)
        {
            yield return await MarkFailedAsync(project, skillBundleResult.Failure);
            yield break;
        }

        var skillBundle = skillBundleResult.Bundle!;
        yield return new ProjectGenerationUpdateDto("skill-context-loaded", "Loaded agent skill context.", null, null, null, null);

        var input = new ProjectGenerationInput(
            project.ProjectNumber,
            project.Idea,
            skillBundle.Version,
            skillBundle.Hash,
            skillBundle.Content);

        var rawJson = new StringBuilder();
        var plannerUpdates = aiPromptPlanner.GenerateProjectPlanAsync(input, cancellationToken).GetAsyncEnumerator(cancellationToken);

        while (true)
        {
            ProjectGenerationUpdateDto? update = null;
            Exception? plannerFailure = null;
            var hasNext = false;
            try
            {
                hasNext = await plannerUpdates.MoveNextAsync();
                update = hasNext ? plannerUpdates.Current : null;
            }
            catch (OperationCanceledException)
            {
                throw;
            }
            catch (Exception exception)
            {
                plannerFailure = exception;
            }

            if (plannerFailure is not null)
            {
                await plannerUpdates.DisposeAsync();
                yield return await MarkFailedAsync(project, plannerFailure);
                yield break;
            }

            if (!hasNext || update is null)
            {
                break;
            }

            if (update.Type == "token" && update.Delta is not null)
            {
                rawJson.Append(update.Delta);
            }

            yield return update;
        }

        await plannerUpdates.DisposeAsync();

        yield return new ProjectGenerationUpdateDto("normalizing", "Normalizing generated prompts.", null, null, null, null);

        var persistResult = await TryPersistGeneratedPlanAsync(project, skillBundle, rawJson.ToString(), cancellationToken);
        if (persistResult.Failure is not null)
        {
            yield return await MarkFailedAsync(project, persistResult.Failure);
            yield break;
        }

        yield return new ProjectGenerationUpdateDto(
            "completed",
            "Prompt pack generated.",
            null,
            null,
            null,
            project.ToDto(persistResult.CompletedAtUtc));
    }

    private async Task<(AgentSkillBundle? Bundle, Exception? Failure)> TryLoadSkillBundleAsync(CancellationToken cancellationToken)
    {
        try
        {
            return (await skillCatalog.LoadBundleAsync(cancellationToken), null);
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception exception)
        {
            return (null, exception);
        }
    }

    private async Task<(DateTimeOffset CompletedAtUtc, Exception? Failure)> TryPersistGeneratedPlanAsync(
        Project project,
        AgentSkillBundle skillBundle,
        string rawJson,
        CancellationToken cancellationToken)
    {
        try
        {
            var generatedPlan = ParseGeneratedPlan(rawJson);
            var validation = await planValidator.ValidateAsync(generatedPlan, cancellationToken);
            if (!validation.IsValid)
            {
                throw new ValidationException(validation.Errors);
            }

            var existingPhases = project.Phases.ToArray();
            dbContext.Phases.RemoveRange(existingPhases);

            var phases = BuildPhases(project.Id, generatedPlan).ToArray();
            project.ReplacePhases(phases);
            dbContext.Phases.AddRange(phases);

            var markdown = markdownRenderer.Render(project, generatedPlan.Estimate);
            var completedAtUtc = dateTimeProvider.UtcNow;
            project.MarkGenerated(
                generatedPlan.Estimate,
                rawJson,
                markdown,
                skillBundle.Version,
                skillBundle.Hash,
                azureDeploymentNameProvider.DeploymentName,
                completedAtUtc);

            await dbContext.SaveChangesAsync(cancellationToken);
            return (completedAtUtc, null);
        }
        catch (OperationCanceledException)
        {
            throw;
        }
        catch (Exception exception)
        {
            return (default, exception);
        }
    }

    private async Task<ProjectGenerationUpdateDto> MarkFailedAsync(Project project, Exception exception)
    {
        var failedAtUtc = dateTimeProvider.UtcNow;
        project.MarkFailed(SanitizeError(exception), failedAtUtc);
        await dbContext.SaveChangesAsync(CancellationToken.None);

        return new ProjectGenerationUpdateDto(
            "failed",
            project.GenerationError ?? "Generation failed.",
            null,
            null,
            null,
            null);
    }

    private static GeneratedProjectPlan ParseGeneratedPlan(string rawJson)
    {
        if (string.IsNullOrWhiteSpace(rawJson))
        {
            throw new JsonException("The AI response was empty.");
        }

        return JsonSerializer.Deserialize<GeneratedProjectPlan>(
            rawJson,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
            ?? throw new JsonException("The AI response did not contain a project plan.");
    }

    private static IEnumerable<Phase> BuildPhases(Guid projectId, GeneratedProjectPlan generatedPlan)
    {
        var phaseOrder = 1;
        foreach (var generatedPhase in generatedPlan.Phases)
        {
            var phase = Phase.Create(projectId, phaseOrder, generatedPhase.Title);
            var promptOrder = 1;
            foreach (var generatedPrompt in generatedPhase.Prompts)
            {
                phase.AddPrompt(
                    promptOrder,
                    generatedPrompt.Title,
                    generatedPrompt.Body,
                    ProjectTagSerializer.Serialize(generatedPrompt.Tags ?? []));
                promptOrder++;
            }

            phase.EnsureContiguousPromptOrder();
            yield return phase;
            phaseOrder++;
        }
    }

    private static string SanitizedValidationMessage(ValidationException exception)
    {
        return string.Join("; ", exception.Errors.Select(error => error.ErrorMessage));
    }

    private static string SanitizeError(Exception exception)
    {
        var message = exception is ValidationException validationException
            ? SanitizedValidationMessage(validationException)
            : exception.Message;

        if (string.IsNullOrWhiteSpace(message))
        {
            return "Generation failed.";
        }

        return message.Length > 1000 ? message[..1000] : message;
    }
}
