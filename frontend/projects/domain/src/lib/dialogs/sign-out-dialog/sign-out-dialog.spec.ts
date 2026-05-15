import { TestBed } from '@angular/core/testing';
import { SignOutDialog } from './sign-out-dialog';

describe('SignOutDialog', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(SignOutDialog);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
