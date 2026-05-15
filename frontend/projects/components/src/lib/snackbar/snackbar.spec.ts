import { TestBed } from '@angular/core/testing';
import { Snackbar } from './snackbar';

describe('Snackbar', () => {
  it('renders when open with status role by default', () => {
    const fixture = TestBed.createComponent(Snackbar);
    fixture.componentRef.setInput('message', 'Saved');
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const snackbar = fixture.nativeElement.querySelector('.snackbar') as HTMLElement;
    expect(snackbar.getAttribute('role')).toBe('status');
    expect(snackbar.textContent).toContain('Saved');
  });

  it('emits dismissed after timeout', () => {
    vi.useFakeTimers();
    try {
      const fixture = TestBed.createComponent(Snackbar);
      fixture.componentRef.setInput('message', 'Saved');
      fixture.componentRef.setInput('open', true);
      fixture.componentRef.setInput('timeout', 10);
      fixture.detectChanges();

      let dismissed = false;
      fixture.componentInstance.dismissed.subscribe(() => (dismissed = true));
      vi.advanceTimersByTime(10);

      expect(dismissed).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});
