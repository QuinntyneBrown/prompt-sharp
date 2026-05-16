using MediatR;

namespace PromptSharp.Application.Abstractions;

public interface ICommand<out TResponse> : IRequest<TResponse>
{
}
