import { Injectable, signal } from '@angular/core';
import { SnackbarTone } from 'components';

export interface NotificationMessage {
  readonly id: string;
  readonly tone: SnackbarTone;
  readonly text: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationCenter {
  private readonly _messages = signal<readonly NotificationMessage[]>([]);
  readonly messages = this._messages.asReadonly();

  push(message: NotificationMessage): void {
    this._messages.update((m) => [...m, message]);
  }

  dismiss(id: string): void {
    this._messages.update((m) => m.filter((x) => x.id !== id));
  }

  clear(): void {
    this._messages.set([]);
  }
}
