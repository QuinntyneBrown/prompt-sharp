import { Guid } from './guid';
import { IsoDateTimeString } from './iso-date-time-string';

export interface AuditEvent {
  id: Guid;
  actor: string;
  action: string;
  targetType: string;
  targetId: string;
  targetName: string;
  before: string;
  after: string;
  changedAt: IsoDateTimeString;
}
