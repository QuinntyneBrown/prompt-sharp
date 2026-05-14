import { Guid } from './guid';

export interface TutorialStepUpsert {
  title: string;
  bodyMarkdown: string;
  codeSnippet?: string | null;
  codeLanguage?: string | null;
  imageMediaId?: Guid | null;
}
