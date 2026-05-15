import { TestBed } from '@angular/core/testing';
import { FilterRail } from './filter-rail';

describe('FilterRail', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(FilterRail);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
