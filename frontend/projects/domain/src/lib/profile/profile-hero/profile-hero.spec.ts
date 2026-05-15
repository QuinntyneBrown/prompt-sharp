import { TestBed } from '@angular/core/testing';
import { ProfileHero } from './profile-hero';

describe('ProfileHero', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(ProfileHero);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
