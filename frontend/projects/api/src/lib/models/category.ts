import { Guid } from './guid';

export interface Category {
  id: Guid;
  slug: string;
  name: string;
  order: number;
  tutorialCount: number;
}
