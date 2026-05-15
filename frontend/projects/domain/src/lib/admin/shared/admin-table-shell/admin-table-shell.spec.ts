import { TestBed } from '@angular/core/testing';
import { AdminTableShell } from './admin-table-shell';

describe('AdminTableShell', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminTableShell);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
