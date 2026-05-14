import { ApiProblemDetails } from './api-problem-details';

export interface ApiValidationProblemDetails extends ApiProblemDetails {
  errors?: Record<string, string[]>;
}
