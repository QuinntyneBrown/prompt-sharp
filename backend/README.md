# PromptSharp v1 Backend

This backend implements `docs/backend-v1-plan.md` for the v1 prompt-pack product.

## Runtime Decision

The plan prefers .NET 10 LTS. This workspace has .NET 9 installed and the repository root README already pins .NET 9, so v1 is implemented on `net9.0` with `backend/global.json` pinned to the 9.0.1xx SDK feature band and `latestPatch` roll-forward. Upgrade to .NET 10 should be scheduled before .NET 9 support ends.

## Local Database

Development and tests target SQL Server Express:

```json
"Server=localhost\\SQLEXPRESS;Database=PromptSharpDev;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=True"
```

Development startup applies EF Core migrations automatically. Production deployments should run migrations explicitly.

## Verification

```powershell
dotnet build backend/PromptSharp.sln --warnaserror
dotnet test backend/PromptSharp.sln
```
