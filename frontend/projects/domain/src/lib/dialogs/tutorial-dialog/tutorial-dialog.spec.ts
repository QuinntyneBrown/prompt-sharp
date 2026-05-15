import { TestBed } from '@angular/core/testing';
import { TutorialDialog } from './tutorial-dialog';

describe('TutorialDialog', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(TutorialDialog);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
