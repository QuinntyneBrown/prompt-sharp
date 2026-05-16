import { Suggestion } from '../models/suggestion';

export const SUGGESTIONS: ReadonlyArray<Suggestion> = [
  {
    label: 'A habit tracker with streaks',
    prompt: 'A habit tracker with daily streaks, weekly reviews, and a calm visual progress chart.'
  },
  {
    label: 'An invoicing tool with Stripe',
    prompt: 'A B2B invoicing tool with Stripe Checkout, PDF export, and a clean client list.'
  },
  {
    label: 'A realtime chat app',
    prompt: 'A realtime chat app with channels, threaded replies, and AI-assisted moderation.'
  },
  {
    label: 'A personal blog with search',
    prompt: 'A personal blog with MDX posts, syntax-highlighted code blocks, and full-text search.'
  }
];
