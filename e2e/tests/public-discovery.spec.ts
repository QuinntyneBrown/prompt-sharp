import { test, expect } from '../fixtures/page-fixtures';
import { contactMessage, tutorial } from '../fixtures/test-data';
import { routes } from '../pages/routes';

test.describe('public discovery', () => {
  test('home promotes featured tutorials, editor pick, categories, latest content, and sign in', async ({
    homePage,
    page,
  }) => {
    await homePage.goto();
    await homePage.expectLoaded();
    await homePage.expectMarketingSections();

    await homePage.browseTutorials();
    await expect(page).toHaveURL(/\/tutorials$/);

    await homePage.goto();
    await homePage.openEditorsPick();
    await expect(page).toHaveURL(/\/tutorials\/.+/);

    await homePage.goto();
    await homePage.signIn();
    await expect(page).toHaveURL(/\/sign-in$/);
  });

  test('catalog searches, filters, switches layout, resets filters, paginates, and opens a tutorial', async ({
    tutorialCatalogPage,
  }) => {
    await tutorialCatalogPage.goto();
    await tutorialCatalogPage.expectLoaded();

    await tutorialCatalogPage.searchFor('clean architecture');
    await tutorialCatalogPage.filterByCategory(tutorial.category);
    await tutorialCatalogPage.filterByDifficulty(tutorial.difficulty);
    await tutorialCatalogPage.useListView();
    await tutorialCatalogPage.expectResults();
    await tutorialCatalogPage.resetFilters();
    await tutorialCatalogPage.openTutorial(/clean architecture/i);
  });

  test('category and tag pages list grouped tutorials with filtering', async ({ categoryPage, tagPage }) => {
    await categoryPage.goto(routes.category('dotnet'));
    await categoryPage.expectLoaded();
    await categoryPage.sortBy('Newest');
    await categoryPage.expectCategoryResults();
    await categoryPage.openTutorial(/\.net|clean architecture/i);

    await tagPage.goto(routes.tag('azure'));
    await tagPage.expectLoaded();
    await tagPage.filterByDifficulty(tutorial.difficulty);
    await tagPage.expectTagResults();
  });

  test('search results preserve the query and surface matching tutorials', async ({ searchResultsPage }) => {
    await searchResultsPage.goto(routes.search('clean architecture'));
    await searchResultsPage.expectLoaded();
    await searchResultsPage.expectResultsFor('clean architecture');

    await searchResultsPage.searchFor('blazor');
    await searchResultsPage.expectResultsFor('blazor');
  });

  test('marketing pages support company context, contact submission, and not-found recovery', async ({
    aboutPage,
    contactPage,
    notFoundPage,
    page,
  }) => {
    await aboutPage.goto();
    await aboutPage.expectLoaded();
    await aboutPage.expectCompanyContext();
    await aboutPage.contact();
    await expect(page).toHaveURL(/\/contact$/);

    await contactPage.expectLoaded();
    await contactPage.submitMessage(contactMessage.name, contactMessage.email, contactMessage.message);
    await contactPage.expectConfirmation();

    await notFoundPage.goto();
    await notFoundPage.expectLoaded();
    await notFoundPage.expectRecoveryActions();
    await notFoundPage.returnHome();
    await expect(page).toHaveURL(/\/$/);
  });
});
