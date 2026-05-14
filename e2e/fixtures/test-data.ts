import path from 'node:path';

export const tutorial = {
  title: 'Build a .NET API with Clean Architecture',
  slug: 'build-dotnet-api-with-clean-architecture',
  category: '.NET',
  tag: 'Azure',
  difficulty: 'Intermediate',
  estimatedMinutes: '45',
  summary: 'Create a production-ready API using controllers, MediatR, EF Core, and SQL Server.',
  step: {
    title: 'Create the solution structure',
    bodyMarkdown: 'Create separate API, Application, Domain, and Infrastructure projects.',
    codeSnippet: 'dotnet new sln --name PromptSharp',
    codeLanguage: 'Bash',
  },
};

export const alternateTutorial = {
  title: 'Ship a Blazor dashboard with Azure Container Apps',
  slug: 'ship-blazor-dashboard-with-azure-container-apps',
  category: 'Blazor',
  tag: 'Container Apps',
  difficulty: 'Advanced',
};

export const users = {
  learner: {
    displayName: 'Alex Learner',
    email: 'alex.learner@example.com',
  },
  editor: {
    displayName: 'Erin Editor',
    email: 'erin.editor@example.com',
  },
  admin: {
    displayName: 'Ada Admin',
    email: 'ada.admin@example.com',
  },
};

export const contactMessage = {
  name: 'Quinn Brown',
  email: 'quinn@example.com',
  message: 'I would like help building Microsoft technology tutorials with PromptSharp.',
};

export const mediaAsset = {
  fileName: 'promptsharp-diagram.svg',
  path: path.resolve(process.cwd(), 'fixtures', 'files', 'promptsharp-diagram.svg'),
};
