import { TestBed } from '@angular/core/testing';
import { RelatedTutorials } from './related-tutorials';

describe('RelatedTutorials', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(RelatedTutorials);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
