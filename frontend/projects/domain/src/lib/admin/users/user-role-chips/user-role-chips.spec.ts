import { TestBed } from '@angular/core/testing';
import { UserRoleChips } from './user-role-chips';

describe('UserRoleChips', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(UserRoleChips);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
