import { DifficultyLevel } from './difficulty-level';
import { PagedQuery } from './paged-query';
import { TutorialSort } from './tutorial-sort';

export interface TutorialListQuery extends PagedQuery {
  search?: string | null;
  category?: string | null;
  tag?: string | null;
  difficulty?: DifficultyLevel | null;
  sort?: TutorialSort | null;
}
