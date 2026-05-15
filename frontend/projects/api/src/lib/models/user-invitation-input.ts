import { RoleName } from './role-name';

export interface UserInvitationInput {
  email: string;
  roles: RoleName[];
}
