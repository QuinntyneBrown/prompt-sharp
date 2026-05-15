import { TestBed } from '@angular/core/testing';
import { SignInCard } from './sign-in-card';

describe('SignInCard', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(SignInCard);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
