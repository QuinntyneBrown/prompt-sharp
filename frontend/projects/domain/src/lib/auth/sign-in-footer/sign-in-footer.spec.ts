import { TestBed } from '@angular/core/testing';
import { SignInFooter } from './sign-in-footer';

describe('SignInFooter', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(SignInFooter);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
