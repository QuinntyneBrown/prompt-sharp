import { test, expect } from '../fixtures/page-fixtures';
import { users } from '../fixtures/test-data';

test.describe('admin governance', () => {
  test.use({ storageState: '.auth/admin.json' });

  test('user role management searches users and changes RBAC assignments', async ({
    userRoleManagementPage,
    page,
  }) => {
    await userRoleManagementPage.goto();
    await userRoleManagementPage.expectLoaded();
    await userRoleManagementPage.expectUsersReady();

    await userRoleManagementPage.searchForUser(users.editor.email);
    await userRoleManagementPage.setRole(users.editor.email, 'Editor', true);
    await userRoleManagementPage.setRole(users.editor.email, 'Admin', false);
    await expect(page.getByRole('status')).toContainText(/roles saved|updated/i);
  });

  test('user invitations validate email and persist pending invite state', async ({
    userRoleManagementPage,
    page,
  }) => {
    await userRoleManagementPage.goto();
    await userRoleManagementPage.expectLoaded();

    await userRoleManagementPage.openInviteDialog();
    await userRoleManagementPage.submitInvite();
    await userRoleManagementPage.expectInviteValidation();

    await userRoleManagementPage.inviteUser(users.invited.email);
    await expect(page.getByRole('status')).toContainText(/invite sent|invited/i);
    await userRoleManagementPage.expectPendingInvitation(users.invited.email);
  });

  test('audit log filters by actor and action and opens event details', async ({ auditLogPage, page }) => {
    await auditLogPage.goto();
    await auditLogPage.expectLoaded();
    await auditLogPage.expectEntries();

    await auditLogPage.filterByActor(users.admin.email);
    await auditLogPage.filterByAction('Publish tutorial');
    await auditLogPage.openFirstEntry();
    await expect(page.getByRole('dialog')).toContainText(/publish tutorial|before|after|changed/i);
  });

  test('notification gallery exposes banner and snackbar variants', async ({ notificationsPage }) => {
    await notificationsPage.goto();
    await notificationsPage.expectLoaded();
    await notificationsPage.expectNotificationVariants();

    await notificationsPage.showSuccess();
    await notificationsPage.expectSuccessSnackbar();
  });
});
