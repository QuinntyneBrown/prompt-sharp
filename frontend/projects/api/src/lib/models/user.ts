import { Guid } from './guid';
import { IsoDateTimeString } from './iso-date-time-string';
import { RoleName } from './role-name';

export interface User {
  id: Guid;
  sub: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: IsoDateTimeString;
  lastSeenAt: IsoDateTimeString;
  roles: RoleName[];
}
