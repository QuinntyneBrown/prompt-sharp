import { PagedQuery } from './paged-query';

export interface AdminTutorialListQuery extends PagedQuery {
  search?: string | null;
}
