import { TestBed } from '@angular/core/testing';
import { StatusDot } from './status-dot';

describe('StatusDot', () => {
  it('is aria-hidden when no label is provided', () => {
    const fixture = TestBed.createComponent(StatusDot);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-hidden')).toBe('true');
  });

  it('exposes role and aria-label when label is provided', () => {
    const fixture = TestBed.createComponent(StatusDot);
    fixture.componentRef.setInput('label', 'Online');
    fixture.componentRef.setInput('tone', 'success');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toBe('Online');
    expect(host.getAttribute('data-tone')).toBe('success');
  });
});
