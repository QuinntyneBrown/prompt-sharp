using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

internal sealed class MediaHandlers(
    IPromptSharpDbContext dbContext,
    IMediaStore mediaStore,
    ICurrentUser currentUser,
    TimeProvider timeProvider) :
    IRequestHandler<ListMediaQuery, IReadOnlyList<MediaDto>>,
    IRequestHandler<UploadMediaCommand, MediaDto>,
    IRequestHandler<DeleteMediaCommand>
{
    public async Task<IReadOnlyList<MediaDto>> Handle(ListMediaQuery request, CancellationToken cancellationToken)
    {
        var media = await dbContext.Media
            .AsNoTracking()
            .OrderByDescending(media => media.UploadedAt)
            .ToArrayAsync(cancellationToken);

        return media.Select(TutorialMapper.ToMediaDto).ToArray();
    }

    public async Task<MediaDto> Handle(UploadMediaCommand request, CancellationToken cancellationToken)
    {
        var user = await RequireCurrentUser(cancellationToken);
        var stored = await mediaStore.SaveAsync(request.FileName, request.ContentType, request.Content, cancellationToken);
        var media = Media.Create(stored.Url, stored.FileName, stored.ContentType, stored.SizeBytes, user.Id, timeProvider.GetUtcNow());
        dbContext.Media.Add(media);
        return TutorialMapper.ToMediaDto(media);
    }

    public async Task Handle(DeleteMediaCommand request, CancellationToken cancellationToken)
    {
        var media = await dbContext.Media.SingleOrDefaultAsync(entity => entity.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException($"Media '{request.Id}' was not found.");

        await mediaStore.DeleteAsync(media.Url, cancellationToken);
        dbContext.Media.Remove(media);
    }

    private async Task<User> RequireCurrentUser(CancellationToken cancellationToken)
    {
        if (!currentUser.IsAuthenticated || string.IsNullOrWhiteSpace(currentUser.Subject))
        {
            throw new ForbiddenException("Authentication is required.");
        }

        return await dbContext.Users.SingleOrDefaultAsync(user => user.Sub == currentUser.Subject, cancellationToken)
            ?? throw new NotFoundException("Current user has not been provisioned.");
    }
}
