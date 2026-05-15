import { TestBed } from '@angular/core/testing';
import { NotificationSnackbarHost } from './notification-snackbar-host';

describe('NotificationSnackbarHost', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(NotificationSnackbarHost);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
