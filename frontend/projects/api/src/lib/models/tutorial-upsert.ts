import { DifficultyLevel } from './difficulty-level';
import { Guid } from './guid';

export interface TutorialUpsert {
  slug: string;
  title: string;
  summary: string;
  difficultyLevel: DifficultyLevel;
  estimatedMinutes: number;
  categoryId: Guid;
  tagIds: Guid[];
}
