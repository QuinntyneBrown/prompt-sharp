import { TestBed } from '@angular/core/testing';
import { ErrorPage } from './error-page';

describe('ErrorPage', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(ErrorPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
