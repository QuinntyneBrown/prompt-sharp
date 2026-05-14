import { DifficultyLevel } from './difficulty-level';
import { Guid } from './guid';
import { IsoDateTimeString } from './iso-date-time-string';
import { Tag } from './tag';
import { TutorialStep } from './tutorial-step';

export interface TutorialDetail {
  id: Guid;
  slug: string;
  title: string;
  summary: string;
  difficultyLevel: DifficultyLevel;
  estimatedMinutes: number;
  isPublished: boolean;
  isFeatured: boolean;
  isEditorsPick: boolean;
  categoryId: Guid;
  categorySlug: string;
  categoryName: string;
  authorId: Guid;
  authorName: string;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  steps: TutorialStep[];
  tags: Tag[];
}
