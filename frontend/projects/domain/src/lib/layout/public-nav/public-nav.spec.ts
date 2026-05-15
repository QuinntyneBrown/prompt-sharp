import { TestBed } from '@angular/core/testing';
import { PublicNav } from './public-nav';

describe('PublicNav', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(PublicNav);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
