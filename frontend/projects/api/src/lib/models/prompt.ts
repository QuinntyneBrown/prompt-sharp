export interface Prompt {
  readonly n: string;
  readonly title: string;
  readonly body: string;
  readonly tags: ReadonlyArray<string>;
}
