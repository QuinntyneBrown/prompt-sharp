import { TestBed } from '@angular/core/testing';
import { TutorialCard } from './tutorial-card';

describe('TutorialCard', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(TutorialCard);
    fixture.componentRef.setInput('title', 'sample');
    fixture.componentRef.setInput('slug', 'sample');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
