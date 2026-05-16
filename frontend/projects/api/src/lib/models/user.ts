import { Plan } from './plan';
import { Session } from './session';

export interface User {
  readonly name: string;
  readonly email: string;
  readonly memberSinceLabel: string;
  readonly plan: Plan;
  readonly session: Session;
}
