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
  private nextId = 0;

  readonly messages = this._messages.asReadonly();

  push(message: NotificationMessage): void {
    this._messages.update((m) => [...m, message]);
  }

  notify(tone: SnackbarTone, text: string): void {
    this.push({ id: `notification-${++this.nextId}`, tone, text });
  }

  success(text: string): void {
    this.notify('success', text);
  }

  error(text: string): void {
    this.notify('danger', text);
  }

  info(text: string): void {
    this.notify('info', text);
  }

  warning(text: string): void {
    this.notify('warning', text);
  }

  dismiss(id: string): void {
    this._messages.update((m) => m.filter((x) => x.id !== id));
  }

  clear(): void {
    this._messages.set([]);
  }
}
