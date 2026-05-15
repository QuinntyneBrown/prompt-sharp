import { TestBed } from '@angular/core/testing';
import { TutorialTracks } from './tutorial-tracks';

describe('TutorialTracks', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(TutorialTracks);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
