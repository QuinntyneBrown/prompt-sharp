import { TestBed } from '@angular/core/testing';
import { SpinnerDot } from './spinner-dot';

describe('SpinnerDot', () => {
  it('exposes role status and accessible label', () => {
    const fixture = TestBed.createComponent(SpinnerDot);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('status');
    expect(host.getAttribute('aria-label')).toBe('Loading');
  });
});
