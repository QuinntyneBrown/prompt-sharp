import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, EmptyState } from 'components';

@Component({
  selector: 'ps-access-denied-page',
  templateUrl: './access-denied-page.html',
  styleUrl: './access-denied-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, EmptyState],
})
export class AccessDeniedPage {
  protected readonly status = signal<string | null>(null);

  protected requestAccess(): void {
    this.status.set('Request sent. An administrator has been notified.');
  }
}
