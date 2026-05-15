import { TestBed } from '@angular/core/testing';
import { MediaGrid } from './media-grid';

describe('MediaGrid', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(MediaGrid);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
