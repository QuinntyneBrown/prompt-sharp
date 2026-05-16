using MediatR;

namespace PromptSharp.Application.Abstractions;

public interface IStreamCommand<out TResponse> : IStreamRequest<TResponse>
{
}
