import { TestBed } from '@angular/core/testing';
import { SessionExpiredDialog } from './session-expired-dialog';

describe('SessionExpiredDialog', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(SessionExpiredDialog);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
