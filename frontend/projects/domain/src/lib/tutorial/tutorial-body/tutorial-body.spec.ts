import { TestBed } from '@angular/core/testing';
import { TutorialBody } from './tutorial-body';

describe('TutorialBody', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(TutorialBody);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
