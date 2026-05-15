import { TestBed } from '@angular/core/testing';
import { TutorialMetadataPanel } from './tutorial-metadata-panel';

describe('TutorialMetadataPanel', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(TutorialMetadataPanel);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
