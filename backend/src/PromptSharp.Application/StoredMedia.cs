using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed record StoredMedia(string Url, string FileName, string ContentType, long SizeBytes);
