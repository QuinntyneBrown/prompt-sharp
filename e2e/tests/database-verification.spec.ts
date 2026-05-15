import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
import { test, expect } from '../fixtures/page-fixtures';
import { mediaAsset, tutorial, users } from '../fixtures/test-data';

const execFileAsync = promisify(execFile);
const apiBaseUrl = process.env.PLAYWRIGHT_API_BASE_URL ?? 'http://127.0.0.1:5000';
const sqlConnection =
  process.env.PROMPTSHARP_SQL_CONNECTION ??
  'Server=.\\SQLEXPRESS;Database=PromptSharp;Trusted_Connection=True;TrustServerCertificate=True;Encrypt=False';
const localMediaRoot = path.resolve(
  process.cwd(),
  '..',
  'backend',
  'src',
  'PromptSharp.Api',
  'App_Data',
  'media',
);

test.describe('SQL Express database verification', () => {
  test.use({ storageState: '.auth/admin.json' });

  test('browser mutations persist to the real SQL Express database', async ({
    adminTutorialListPage,
    contactPage,
    mediaLibraryPage,
    page,
    userRoleManagementPage,
  }) => {
    test.setTimeout(180_000);
    const suffix = Date.now().toString(36);

    await verifyRequiredSeedData();

    const contactEmail = `sql-contact-${suffix}@example.com`;
    await contactPage.goto();
    await contactPage.submitMessage('SQL Verifier', contactEmail, `Database verification ${suffix}`);
    await contactPage.expectConfirmation();
    await expectSqlCount(
      `SELECT COUNT(1) AS Count FROM ContactSubmissions WHERE Email = '${escapeSql(contactEmail)}'`,
      1,
    );

    const tutorialSlug = `sql-verification-${suffix}`;
    const tutorialTitle = `SQL Verification ${suffix}`;
    await adminTutorialListPage.goto();
    await adminTutorialListPage.expectLoaded();
    await adminTutorialListPage.createDraftFromDialog({
      title: tutorialTitle,
      slug: tutorialSlug,
      summary: 'Created through the browser and verified directly in SQL Express.',
      category: tutorial.category,
      difficulty: 'Beginner',
      estimatedMinutes: '8',
    });
    await expect(page).toHaveURL(/\/admin\/tutorials\/[^/]+\/edit$/);
    await expectSqlCount(
      `SELECT COUNT(1) AS Count FROM Tutorials WHERE Slug = '${escapeSql(tutorialSlug)}' AND IsPublished = 0`,
      1,
    );
    await expectSqlCount(
      `SELECT COUNT(1) AS Count FROM AuditEvents WHERE Action = 'Create tutorial' AND TargetName = '${escapeSql(tutorialTitle)}'`,
      1,
    );

    const inviteEmail = `sql-invite-${suffix}@example.com`;
    await userRoleManagementPage.goto();
    await userRoleManagementPage.expectLoaded();
    await userRoleManagementPage.inviteUser(inviteEmail);
    await expect(page.getByRole('status')).toContainText(/invite sent|invited/i);
    await expectSqlCount(
      `SELECT COUNT(1) AS Count FROM UserInvitations WHERE Email = '${escapeSql(inviteEmail)}'`,
      1,
    );

    await mediaLibraryPage.goto();
    await mediaLibraryPage.expectLoaded();
    await mediaLibraryPage.delayNextUpload(250);
    const uploadedMedia = await mediaLibraryPage.upload(mediaAsset.path);
    await expect(page.getByRole('status')).toContainText(/uploaded/i);
    await expectSqlCount(
      `SELECT COUNT(1) AS Count FROM Media WHERE FileName = '${escapeSql(mediaAsset.fileName)}'`,
      1,
    );
    const mediaResponse = await page.request.get(new URL(uploadedMedia.url, apiBaseUrl).toString());
    expect(mediaResponse.ok()).toBe(true);
    expect(mediaResponse.headers()['content-type']).toContain('image/svg+xml');
    expect(fs.existsSync(path.join(localMediaRoot, path.basename(uploadedMedia.url)))).toBe(true);

    await expectSqlCount(
      `SELECT COUNT(1) AS Count
       FROM Users u
       JOIN UserRoles ur ON ur.UserId = u.Id
       JOIN Roles r ON r.Id = ur.RoleId
       WHERE u.Email = '${escapeSql(users.admin.email)}' AND r.Name = 'Admin'`,
      1,
    );
  });
});

async function verifyRequiredSeedData(): Promise<void> {
  await expectSqlCount(
    `SELECT COUNT(1) AS Count
     FROM Tutorials
     WHERE Slug IN ('build-a-dotnet-api', 'deploy-to-azure', 'secure-blazor-app', 'draft-openai-workflow')`,
    4,
  );
  await expectSqlCount(
    `SELECT COUNT(1) AS Count
     FROM Tutorials t
     JOIN TutorialSteps s ON s.TutorialId = t.Id
     WHERE t.Slug = 'build-a-dotnet-api'
     GROUP BY t.Id
     HAVING COUNT(1) >= 4`,
    1,
  );
  await expectSqlCount(
    `SELECT COUNT(1) AS Count
     FROM Categories
     WHERE Name IN ('.NET', 'Azure', 'Blazor', 'AI')`,
    4,
  );
  await expectSqlCount(
    `SELECT COUNT(1) AS Count
     FROM Tags
     WHERE Name IN ('C#', 'ASP.NET Core', 'SQL Server', 'OpenAI', 'Security')`,
    5,
  );
  await expectSqlCount(
    `SELECT COUNT(1) AS Count
     FROM Users
     WHERE Email IN ('${escapeSql(users.learner.email)}', '${escapeSql(users.editor.email)}', '${escapeSql(users.admin.email)}')`,
    3,
  );
  await expectSqlCount(
    `SELECT COUNT(1) AS Count
     FROM Media
     WHERE FileName IN ('promptsharp-diagram.svg', 'promptsharp-pixel.png')`,
    2,
  );
  await expectSqlCount(
    `SELECT COUNT(1) AS Count
     FROM AuditEvents
     WHERE Action IN ('Create tutorial', 'Publish tutorial', 'Upload media', 'Invite user')`,
    4,
  );
}

async function expectSqlCount(sql: string, minimum: number): Promise<void> {
  const rows = await sqlRows<{ Count: number }>(sql);
  const count = Number(rows[0]?.Count ?? 0);
  expect(count).toBeGreaterThanOrEqual(minimum);
}

async function sqlRows<T>(sql: string): Promise<T[]> {
  const script = `
$ErrorActionPreference = 'Stop'
$connection = New-Object System.Data.SqlClient.SqlConnection '${sqlConnection.replace(/'/g, "''")}'
$command = $connection.CreateCommand()
$command.CommandText = @"
${sql}
"@
$connection.Open()
try {
  $reader = $command.ExecuteReader()
  $rows = New-Object System.Collections.ArrayList
  while ($reader.Read()) {
    $row = [ordered]@{}
    for ($i = 0; $i -lt $reader.FieldCount; $i++) {
      $value = $reader.GetValue($i)
      if ($value -is [System.DBNull]) {
        $value = $null
      } elseif ($value -is [System.Guid]) {
        $value = $value.ToString()
      } elseif ($value -is [System.DateTimeOffset]) {
        $value = $value.ToString('o')
      } elseif ($value -is [System.DateTime]) {
        $value = $value.ToString('o')
      }
      $row[$reader.GetName($i)] = $value
    }
    [void]$rows.Add([pscustomobject]$row)
  }
  if ($rows.Count -eq 0) {
    '[]'
  } else {
    $rows | ConvertTo-Json -Depth 8
  }
} finally {
  if ($reader) { $reader.Dispose() }
  $connection.Dispose()
}
`;
  const { stdout } = await execFileAsync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script], {
    maxBuffer: 1024 * 1024,
  });
  const trimmed = stdout.trim();
  if (!trimmed) {
    return [];
  }

  const parsed = JSON.parse(trimmed) as T | T[];
  return Array.isArray(parsed) ? parsed : [parsed];
}

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}
