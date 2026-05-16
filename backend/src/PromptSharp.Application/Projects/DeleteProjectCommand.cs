using PromptSharp.Application.Abstractions;

namespace PromptSharp.Application.Projects;

public sealed record DeleteProjectCommand(int ProjectNumber) : ICommand;
