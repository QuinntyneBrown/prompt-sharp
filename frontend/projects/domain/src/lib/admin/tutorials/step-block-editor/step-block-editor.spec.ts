import { TestBed } from '@angular/core/testing';
import { StepBlockEditor } from './step-block-editor';

describe('StepBlockEditor', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(StepBlockEditor);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
