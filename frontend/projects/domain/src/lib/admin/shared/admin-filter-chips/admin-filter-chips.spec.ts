import { TestBed } from '@angular/core/testing';
import { AdminFilterChips } from './admin-filter-chips';

describe('AdminFilterChips', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminFilterChips);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
