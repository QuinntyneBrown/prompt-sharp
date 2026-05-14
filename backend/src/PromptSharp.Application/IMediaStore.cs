using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using PromptSharp.Domain;

namespace PromptSharp.Application;

public interface IMediaStore
{
    Task<StoredMedia> SaveAsync(string fileName, string contentType, Stream content, CancellationToken cancellationToken);

    Task DeleteAsync(string url, CancellationToken cancellationToken);
}
