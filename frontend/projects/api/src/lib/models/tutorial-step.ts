import { Guid } from './guid';

export interface TutorialStep {
  id: Guid;
  order: number;
  title: string;
  bodyMarkdown: string;
  codeSnippet: string | null;
  codeLanguage: string | null;
  imageMediaId: Guid | null;
}
