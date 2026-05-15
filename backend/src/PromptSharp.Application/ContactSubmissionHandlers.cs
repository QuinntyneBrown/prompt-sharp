using MediatR;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class ContactSubmissionHandlers(
    IPromptSharpDbContext dbContext,
    TimeProvider timeProvider) :
    IRequestHandler<SubmitContactSubmissionCommand, ContactSubmissionDto>
{
    public async Task<ContactSubmissionDto> Handle(SubmitContactSubmissionCommand request, CancellationToken cancellationToken)
    {
        var submission = ContactSubmission.Create(
            request.Input.Name,
            request.Input.Email,
            request.Input.Message,
            timeProvider.GetUtcNow());

        dbContext.ContactSubmissions.Add(submission);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new ContactSubmissionDto(
            submission.Id,
            submission.Name,
            submission.Email,
            submission.Message,
            submission.CreatedAt);
    }
}
