import { Prompt } from './prompt';

export interface Phase {
  readonly ix: string;
  readonly title: string;
  readonly prompts: ReadonlyArray<Prompt>;
}
