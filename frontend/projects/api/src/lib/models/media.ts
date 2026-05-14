import { Guid } from './guid';
import { IsoDateTimeString } from './iso-date-time-string';

export interface Media {
  id: Guid;
  url: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  uploadedById: Guid;
  uploadedAt: IsoDateTimeString;
}
