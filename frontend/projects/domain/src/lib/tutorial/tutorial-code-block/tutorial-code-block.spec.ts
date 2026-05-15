import { TestBed } from '@angular/core/testing';
import { TutorialCodeBlock } from './tutorial-code-block';

describe('TutorialCodeBlock', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(TutorialCodeBlock);
    fixture.componentRef.setInput('code', 'sample');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
