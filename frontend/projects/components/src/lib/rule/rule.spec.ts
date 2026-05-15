import { TestBed } from '@angular/core/testing';
import { Rule } from './rule';

describe('Rule', () => {
  it('defaults to horizontal separator role', () => {
    const fixture = TestBed.createComponent(Rule);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('separator');
    expect(host.getAttribute('aria-orientation')).toBe('horizontal');
    expect(host.getAttribute('data-variant')).toBe('default');
  });

  it('reflects vertical orientation', () => {
    const fixture = TestBed.createComponent(Rule);
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-orientation')).toBe('vertical');
  });
});
