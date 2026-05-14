using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using PromptSharp.Domain;

namespace PromptSharp.Application;

public sealed class NotFoundException(string message) : Exception(message);
