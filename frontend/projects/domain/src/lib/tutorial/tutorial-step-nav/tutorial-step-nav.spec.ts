import { TestBed } from '@angular/core/testing';
import { TutorialStepNav } from './tutorial-step-nav';

describe('TutorialStepNav', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(TutorialStepNav);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
