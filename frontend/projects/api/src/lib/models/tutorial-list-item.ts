import { DifficultyLevel } from './difficulty-level';
import { Guid } from './guid';

export interface TutorialListItem {
  id: Guid;
  slug: string;
  title: string;
  summary: string;
  difficultyLevel: DifficultyLevel;
  estimatedMinutes: number;
  isPublished: boolean;
  isFeatured: boolean;
  isEditorsPick: boolean;
  categorySlug: string;
  categoryName: string;
  tags: string[];
  stepCount: number;
}
