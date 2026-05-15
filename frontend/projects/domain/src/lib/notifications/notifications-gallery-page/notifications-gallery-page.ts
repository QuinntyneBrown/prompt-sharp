import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button, Snackbar, SnackbarTone } from 'components';
import { NotificationBanner } from '../notification-banner/notification-banner';
import { NotificationCenter } from '../notification-center/notification-center';

@Component({
  selector: 'ps-notifications-gallery-page',
  templateUrl: './notifications-gallery-page.html',
  styleUrl: './notifications-gallery-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, NotificationBanner, Snackbar],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotificationsGalleryPage {
  private readonly notifications = inject(NotificationCenter);

  protected readonly variants: Array<{ tone: SnackbarTone; label: string; message: string }> = [
    { tone: 'success', label: 'Success', message: 'Tutorial saved.' },
    { tone: 'info', label: 'Info', message: 'Publishing review is in progress.' },
    { tone: 'warning', label: 'Warning', message: 'Upload is still processing.' },
    { tone: 'danger', label: 'Error', message: 'The action could not be completed.' },
  ];

  protected showNotification(tone: SnackbarTone, message: string): void {
    this.notifications.notify(tone, message);
  }
}
