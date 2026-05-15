import { TestBed } from '@angular/core/testing';
import { SignInFieldRow } from './sign-in-field-row';

describe('SignInFieldRow', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(SignInFieldRow);
    fixture.componentRef.setInput('label', 'sample');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
