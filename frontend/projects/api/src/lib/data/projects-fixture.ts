import { ProjectSummary } from '../models/project-summary';

export const PROJECTS_FIXTURE: ReadonlyArray<ProjectSummary> = [
  {
    id: '0142',
    idea: 'A markdown note-taking app with realtime sync, end-to-end encryption, and OAuth',
    promptCount: 14,
    whenLabel: '4m ago',
    status: 'in progress'
  },
  {
    id: '0141',
    idea: 'A focus timer for ADHD brains, with a one-button mode and visible body-doubling',
    promptCount: 38,
    whenLabel: '3h ago',
    status: 'in progress'
  },
  {
    id: '0140',
    idea: 'A team retro tool with anonymous voting and AI summary',
    promptCount: 29,
    whenLabel: 'yesterday',
    status: 'in progress'
  },
  {
    id: '0139',
    idea: "A wedding RSVP site that doesn't suck",
    promptCount: 21,
    whenLabel: '2d ago',
    status: 'shipped'
  },
  {
    id: '0138',
    idea: 'A static blog with MDX and full-text search',
    promptCount: 18,
    whenLabel: '4d ago',
    status: 'shipped'
  },
  {
    id: '0137',
    idea: 'An invoice tool with Stripe checkout and PDF export',
    promptCount: 32,
    whenLabel: '1w ago',
    status: 'shipped'
  },
  {
    id: '0136',
    idea: 'A habit tracker with streaks and weekly reviews',
    promptCount: 24,
    whenLabel: '1w ago',
    status: 'in progress'
  },
  {
    id: '0135',
    idea: 'A realtime chat app with AI moderation',
    promptCount: 41,
    whenLabel: '2w ago',
    status: 'shipped'
  },
  {
    id: '0134',
    idea: 'A meal planner that respects dietary restrictions',
    promptCount: 27,
    whenLabel: '3w ago',
    status: 'shipped'
  }
];
