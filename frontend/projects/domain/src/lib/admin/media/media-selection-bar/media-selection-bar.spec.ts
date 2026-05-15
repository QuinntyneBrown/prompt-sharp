import { TestBed } from '@angular/core/testing';
import { MediaSelectionBar } from './media-selection-bar';

describe('MediaSelectionBar', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(MediaSelectionBar);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
