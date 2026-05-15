import { TestBed } from '@angular/core/testing';
import { AdminNavRail } from './admin-nav-rail';

describe('AdminNavRail', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminNavRail);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
