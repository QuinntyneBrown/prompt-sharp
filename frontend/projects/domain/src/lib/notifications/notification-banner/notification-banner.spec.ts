import { TestBed } from '@angular/core/testing';
import { NotificationBanner } from './notification-banner';

describe('NotificationBanner', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(NotificationBanner);
    fixture.componentRef.setInput('message', 'sample');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
