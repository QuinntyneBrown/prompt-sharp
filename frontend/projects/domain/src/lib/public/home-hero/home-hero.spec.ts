import { TestBed } from '@angular/core/testing';
import { HomeHero } from './home-hero';

describe('HomeHero', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(HomeHero);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
