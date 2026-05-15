import { TestBed } from '@angular/core/testing';
import { TutorialToc } from './tutorial-toc';

describe('TutorialToc', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(TutorialToc);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
