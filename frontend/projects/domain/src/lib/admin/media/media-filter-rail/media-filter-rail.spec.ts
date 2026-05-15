import { TestBed } from '@angular/core/testing';
import { MediaFilterRail } from './media-filter-rail';

describe('MediaFilterRail', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(MediaFilterRail);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
