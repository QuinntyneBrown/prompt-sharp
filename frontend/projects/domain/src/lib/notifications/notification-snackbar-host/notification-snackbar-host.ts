import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-notification-snackbar-host',
  templateUrl: './notification-snackbar-host.html',
  styleUrl: './notification-snackbar-host.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSnackbarHost {
}
