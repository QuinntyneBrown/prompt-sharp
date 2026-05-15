import { TestBed } from '@angular/core/testing';
import { PublicFooter } from './public-footer';

describe('PublicFooter', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(PublicFooter);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
