# PromptSharp Backend

.NET 9 Clean Architecture backend for the Prompt/Sharp tutorial platform.

## Local Development

```powershell
docker compose up -d
dotnet restore
dotnet run --project src/PromptSharp.Api
```

The API listens on `https://localhost:5001` and exposes OpenAPI at `/openapi/v1.json`.

## Verification

```powershell
dotnet build PromptSharp.sln --warnaserror
dotnet test PromptSharp.sln
```

SQL Server integration tests use Testcontainers when `RUN_TESTCONTAINERS=true`. On ARM64 they use Azure SQL Edge because the SQL Server 2022 Linux container image is amd64-only.

## Database

Development startup applies EF Core migrations automatically. Production startup does not apply migrations; run:

```powershell
dotnet ef database update --project src/PromptSharp.Infrastructure --startup-project src/PromptSharp.Api
```

## Media Storage

Local development stores media under `App_Data/media` and serves it from `/media`. Production can switch to Azure Blob Storage by setting:

```text
AppSettings__Media__Provider=AzureBlob
AppSettings__Media__AzureConnectionString=<connection string>
AppSettings__Media__AzureContainerName=media
AppSettings__Media__CdnBaseUrl=<cdn base url>
```

SVG uploads are sanitized for script and event-handler content. EXIF stripping is intentionally not implemented in v1.
