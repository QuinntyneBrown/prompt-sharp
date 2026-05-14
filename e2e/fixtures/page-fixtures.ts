import { test as base } from '@playwright/test';
import { AboutPage } from '../pages/about.page';
import { AccessDeniedPage } from '../pages/access-denied.page';
import { AdminDashboardPage } from '../pages/admin-dashboard.page';
import { AdminTutorialListPage } from '../pages/admin-tutorial-list.page';
import { AuditLogPage } from '../pages/audit-log.page';
import { CategoryPage } from '../pages/category.page';
import { CategoryTagManagementPage } from '../pages/category-tag-management.page';
import { ContactPage } from '../pages/contact.page';
import { HomePage } from '../pages/home.page';
import { MediaLibraryPage } from '../pages/media-library.page';
import { NotFoundPage } from '../pages/not-found.page';
import { OAuthCallbackPage } from '../pages/oauth-callback.page';
import { ProfilePage } from '../pages/profile.page';
import { ProgressBookmarksPage } from '../pages/progress-bookmarks.page';
import { SearchResultsPage } from '../pages/search-results.page';
import { SignInPage } from '../pages/sign-in.page';
import { StepEditorPage } from '../pages/step-editor.page';
import { TagPage } from '../pages/tag.page';
import { TutorialCatalogPage } from '../pages/tutorial-catalog.page';
import { TutorialDetailPage } from '../pages/tutorial-detail.page';
import { TutorialEditorPage } from '../pages/tutorial-editor.page';
import { UserRoleManagementPage } from '../pages/user-role-management.page';

type PromptSharpFixtures = {
  aboutPage: AboutPage;
  accessDeniedPage: AccessDeniedPage;
  adminDashboardPage: AdminDashboardPage;
  adminTutorialListPage: AdminTutorialListPage;
  auditLogPage: AuditLogPage;
  categoryPage: CategoryPage;
  categoryTagManagementPage: CategoryTagManagementPage;
  contactPage: ContactPage;
  homePage: HomePage;
  mediaLibraryPage: MediaLibraryPage;
  notFoundPage: NotFoundPage;
  oauthCallbackPage: OAuthCallbackPage;
  profilePage: ProfilePage;
  progressBookmarksPage: ProgressBookmarksPage;
  searchResultsPage: SearchResultsPage;
  signInPage: SignInPage;
  stepEditorPage: StepEditorPage;
  tagPage: TagPage;
  tutorialCatalogPage: TutorialCatalogPage;
  tutorialDetailPage: TutorialDetailPage;
  tutorialEditorPage: TutorialEditorPage;
  userRoleManagementPage: UserRoleManagementPage;
};

export const test = base.extend<PromptSharpFixtures>({
  aboutPage: async ({ page }, use) => use(new AboutPage(page)),
  accessDeniedPage: async ({ page }, use) => use(new AccessDeniedPage(page)),
  adminDashboardPage: async ({ page }, use) => use(new AdminDashboardPage(page)),
  adminTutorialListPage: async ({ page }, use) => use(new AdminTutorialListPage(page)),
  auditLogPage: async ({ page }, use) => use(new AuditLogPage(page)),
  categoryPage: async ({ page }, use) => use(new CategoryPage(page)),
  categoryTagManagementPage: async ({ page }, use) => use(new CategoryTagManagementPage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),
  homePage: async ({ page }, use) => use(new HomePage(page)),
  mediaLibraryPage: async ({ page }, use) => use(new MediaLibraryPage(page)),
  notFoundPage: async ({ page }, use) => use(new NotFoundPage(page)),
  oauthCallbackPage: async ({ page }, use) => use(new OAuthCallbackPage(page)),
  profilePage: async ({ page }, use) => use(new ProfilePage(page)),
  progressBookmarksPage: async ({ page }, use) => use(new ProgressBookmarksPage(page)),
  searchResultsPage: async ({ page }, use) => use(new SearchResultsPage(page)),
  signInPage: async ({ page }, use) => use(new SignInPage(page)),
  stepEditorPage: async ({ page }, use) => use(new StepEditorPage(page)),
  tagPage: async ({ page }, use) => use(new TagPage(page)),
  tutorialCatalogPage: async ({ page }, use) => use(new TutorialCatalogPage(page)),
  tutorialDetailPage: async ({ page }, use) => use(new TutorialDetailPage(page)),
  tutorialEditorPage: async ({ page }, use) => use(new TutorialEditorPage(page)),
  userRoleManagementPage: async ({ page }, use) => use(new UserRoleManagementPage(page)),
});

export { expect } from '@playwright/test';
