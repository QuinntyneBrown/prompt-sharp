namespace PromptSharp.Application;

public sealed record SubmitContactSubmissionCommand(ContactSubmissionInputDto Input) : ICommand<ContactSubmissionDto>;
