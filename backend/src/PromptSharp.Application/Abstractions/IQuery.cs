using MediatR;

namespace PromptSharp.Application.Abstractions;

public interface IQuery<out TResponse> : IRequest<TResponse>
{
}
