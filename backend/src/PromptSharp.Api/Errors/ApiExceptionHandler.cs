using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using PromptSharp.Application.Common;
using PromptSharp.Domain.Validation;

namespace PromptSharp.Api.Errors;

public sealed class ApiExceptionHandler(IProblemDetailsService problemDetailsService) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var problemDetails = CreateProblemDetails(httpContext, exception);
        httpContext.Response.StatusCode = problemDetails.Status ?? StatusCodes.Status500InternalServerError;

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = problemDetails
        });
    }

    private static ProblemDetails CreateProblemDetails(HttpContext httpContext, Exception exception)
    {
        return exception switch
        {
            ValidationException validationException => ValidationProblem(httpContext, validationException),
            AuthenticationFailedException => Problem(httpContext, StatusCodes.Status401Unauthorized, "Unauthorized", exception.Message),
            UnauthorizedCurrentUserException => Problem(httpContext, StatusCodes.Status401Unauthorized, "Unauthorized", exception.Message),
            NotFoundException => Problem(httpContext, StatusCodes.Status404NotFound, "Not Found", exception.Message),
            ConflictException => Problem(httpContext, StatusCodes.Status409Conflict, "Conflict", exception.Message),
            DomainRuleException => Problem(httpContext, StatusCodes.Status400BadRequest, "Bad Request", exception.Message),
            ArgumentOutOfRangeException => Problem(httpContext, StatusCodes.Status400BadRequest, "Bad Request", exception.Message),
            _ => Problem(httpContext, StatusCodes.Status500InternalServerError, "Server Error", "An unexpected error occurred.")
        };
    }

    private static ValidationProblemDetails ValidationProblem(HttpContext httpContext, ValidationException exception)
    {
        var errors = exception.Errors
            .GroupBy(error => error.PropertyName)
            .ToDictionary(group => ToCamelCase(group.Key), group => group.Select(error => error.ErrorMessage).ToArray());

        return new ValidationProblemDetails(errors)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Validation failed.",
            Instance = httpContext.Request.Path
        };
    }

    private static ProblemDetails Problem(HttpContext httpContext, int statusCode, string title, string detail)
    {
        return new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = httpContext.Request.Path
        };
    }

    private static string ToCamelCase(string value)
    {
        return string.IsNullOrWhiteSpace(value) ? value : char.ToLowerInvariant(value[0]) + value[1..];
    }
}
