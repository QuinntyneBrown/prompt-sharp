import { TestBed } from '@angular/core/testing';
import { LatestTutorials } from './latest-tutorials';

describe('LatestTutorials', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(LatestTutorials);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
