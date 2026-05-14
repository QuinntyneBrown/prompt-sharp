import { Guid } from './guid';

export interface ProgressUpsert {
  currentStepId?: Guid | null;
  completedStepIds: Guid[];
}
