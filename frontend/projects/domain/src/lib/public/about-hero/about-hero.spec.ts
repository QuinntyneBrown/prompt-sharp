import { TestBed } from '@angular/core/testing';
import { AboutHero } from './about-hero';

describe('AboutHero', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AboutHero);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
