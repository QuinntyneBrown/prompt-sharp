import { PromptSharpAccessTokenProvider } from './prompt-sharp-access-token-provider';

export interface PromptSharpApiConfig {
  baseUrl?: string;
  accessToken?: PromptSharpAccessTokenProvider;
}
