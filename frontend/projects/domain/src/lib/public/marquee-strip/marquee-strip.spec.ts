import { TestBed } from '@angular/core/testing';
import { MarqueeStrip } from './marquee-strip';

describe('MarqueeStrip', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(MarqueeStrip);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
