import { TestBed } from '@angular/core/testing';
import { AdminUserRow } from './admin-user-row';

describe('AdminUserRow', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminUserRow);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
