import { TestBed } from '@angular/core/testing';
import { FeaturedTutorials } from './featured-tutorials';

describe('FeaturedTutorials', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(FeaturedTutorials);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
