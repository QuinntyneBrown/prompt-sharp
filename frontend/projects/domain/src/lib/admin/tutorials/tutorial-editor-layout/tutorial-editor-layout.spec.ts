import { TestBed } from '@angular/core/testing';
import { TutorialEditorLayout } from './tutorial-editor-layout';

describe('TutorialEditorLayout', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(TutorialEditorLayout);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
