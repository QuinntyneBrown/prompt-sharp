import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ps-notification-banner',
  templateUrl: './notification-banner.html',
  styleUrl: './notification-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBanner {
  readonly message = input.required<string>();
  readonly tone = input<'info' | 'success' | 'warning' | 'danger' | null>(null);
  readonly dismissed = output<void>();
}
