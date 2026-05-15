import { TestBed } from '@angular/core/testing';
import { TutorialHero } from './tutorial-hero';

describe('TutorialHero', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(TutorialHero);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
