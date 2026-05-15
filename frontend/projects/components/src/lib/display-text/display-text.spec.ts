import { TestBed } from '@angular/core/testing';
import { DisplayText } from './display-text';

describe('DisplayText', () => {
  it('defaults to level 1 / tone default', () => {
    const fixture = TestBed.createComponent(DisplayText);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-level')).toBe('1');
    expect(host.getAttribute('data-tone')).toBe('default');
  });

  it('reflects italic accent input', () => {
    const fixture = TestBed.createComponent(DisplayText);
    fixture.componentRef.setInput('italicAccent', true);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).getAttribute('data-italic-accent')).toBe('true');
  });
});
