import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Banner, BannerTone, IconButton } from 'components';

@Component({
  selector: 'ps-notification-banner',
  templateUrl: './notification-banner.html',
  styleUrl: './notification-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Banner, IconButton],
})
export class NotificationBanner {
  readonly message = input.required<string>();
  readonly tone = input<BannerTone>('default');
  readonly dismissed = output<void>();
}
