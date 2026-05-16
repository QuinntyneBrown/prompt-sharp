import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';
import { USER_FIXTURE } from '../data/user-fixture';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<User | null>(USER_FIXTURE);

  readonly currentUser = this._currentUser.asReadonly();

  signOut(): void {
    this._currentUser.set(null);
  }
}
