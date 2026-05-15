import { TestBed } from '@angular/core/testing';
import { UserInviteDialog } from './user-invite-dialog';

describe('UserInviteDialog', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(UserInviteDialog);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
