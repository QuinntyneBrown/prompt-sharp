import { User } from '../models/user';

export const USER_FIXTURE: User = {
  name: 'Quinntyne Brown',
  email: 'quinntynebrown@gmail.com',
  memberSinceLabel: 'May 15, 2026',
  plan: {
    name: 'Free',
    tier: 'tier',
    projectsUsed: 3,
    projectQuota: 5,
    resetsLabel: 'June 1'
  },
  session: {
    lastSignInLabel: 'Today, 10:42 AM',
    device: 'Windows · Chrome'
  }
};
