import { TestBed } from '@angular/core/testing';
import { AdminUsersTable } from './admin-users-table';

describe('AdminUsersTable', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminUsersTable);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
