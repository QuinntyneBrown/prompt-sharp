import { Guid } from './guid';
import { IsoDateTimeString } from './iso-date-time-string';

export interface ContactSubmission {
  id: Guid;
  name: string;
  email: string;
  message: string;
  createdAt: IsoDateTimeString;
}
