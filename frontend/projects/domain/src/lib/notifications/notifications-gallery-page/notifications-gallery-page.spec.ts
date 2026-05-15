import { TestBed } from '@angular/core/testing';
import { NotificationsGalleryPage } from './notifications-gallery-page';

describe('NotificationsGalleryPage', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(NotificationsGalleryPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
