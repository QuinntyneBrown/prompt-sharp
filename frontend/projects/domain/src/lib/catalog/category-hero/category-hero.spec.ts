import { TestBed } from '@angular/core/testing';
import { CategoryHero } from './category-hero';

describe('CategoryHero', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(CategoryHero);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
