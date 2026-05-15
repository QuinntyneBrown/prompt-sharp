import { TestBed } from '@angular/core/testing';
import { AdminDashboardPage } from './admin-dashboard-page';

describe('AdminDashboardPage', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminDashboardPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
