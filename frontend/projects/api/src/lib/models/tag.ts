import { Guid } from './guid';

export interface Tag {
  id: Guid;
  slug: string;
  name: string;
}
