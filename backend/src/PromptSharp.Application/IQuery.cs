using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using PromptSharp.Domain;

namespace PromptSharp.Application;

public interface IQuery<out TResponse> : IRequest<TResponse>, IRequestIntent;
