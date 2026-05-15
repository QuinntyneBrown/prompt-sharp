import { TestBed } from '@angular/core/testing';
import { SignInPage } from './sign-in-page';

describe('SignInPage', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(SignInPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
