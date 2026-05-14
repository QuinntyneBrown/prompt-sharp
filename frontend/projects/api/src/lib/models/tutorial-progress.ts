import { Guid } from './guid';
import { IsoDateTimeString } from './iso-date-time-string';

export interface TutorialProgress {
  userId: Guid;
  tutorialId: Guid;
  currentStepId: Guid | null;
  completedStepIds: Guid[];
  updatedAt: IsoDateTimeString;
}
