import { TestBed } from '@angular/core/testing';
import { AboutPage } from './about-page';

describe('AboutPage', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AboutPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
