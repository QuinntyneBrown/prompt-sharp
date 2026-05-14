import { IsoDateTimeString } from './iso-date-time-string';
import { TutorialListItem } from './tutorial-list-item';

export interface Bookmark {
  tutorial: TutorialListItem;
  createdAt: IsoDateTimeString;
}
