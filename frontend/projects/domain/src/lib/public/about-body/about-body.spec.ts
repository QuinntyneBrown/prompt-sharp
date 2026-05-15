import { TestBed } from '@angular/core/testing';
import { AboutBody } from './about-body';

describe('AboutBody', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AboutBody);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
