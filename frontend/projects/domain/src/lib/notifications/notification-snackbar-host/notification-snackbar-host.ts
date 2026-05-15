import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Snackbar } from 'components';
import { NotificationCenter } from '../notification-center/notification-center';

@Component({
  selector: 'ps-notification-snackbar-host',
  templateUrl: './notification-snackbar-host.html',
  styleUrl: './notification-snackbar-host.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Snackbar],
})
export class NotificationSnackbarHost {
  protected readonly center = inject(NotificationCenter);

  protected dismiss(id: string): void {
    this.center.dismiss(id);
  }
}
