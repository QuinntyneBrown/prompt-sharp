import { Guid } from './guid';
import { IsoDateTimeString } from './iso-date-time-string';
import { RoleName } from './role-name';

export interface UserInvitation {
  id: Guid;
  email: string;
  roles: RoleName[];
  invitedBy: string;
  createdAt: IsoDateTimeString;
  acceptedAt: IsoDateTimeString | null;
}
