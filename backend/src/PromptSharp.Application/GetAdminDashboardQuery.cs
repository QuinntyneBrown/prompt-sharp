using PromptSharp.Domain;

namespace PromptSharp.Application.Features;

[AuthorizeRequest(RoleNames.Admin)]
public sealed record GetAdminDashboardQuery() : IQuery<AdminDashboardDto>;
