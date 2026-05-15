import { TestBed } from '@angular/core/testing';
import { DialogShell } from './dialog-shell';

describe('DialogShell', () => {
  it('is hidden when closed', () => {
    const fixture = TestBed.createComponent(DialogShell);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.dialog').hasAttribute('hidden')).toBe(true);
  });

  it('wires headline and supporting text to dialog accessibility attributes', () => {
    const fixture = TestBed.createComponent(DialogShell);
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('headline', 'Publish tutorial');
    fixture.componentRef.setInput('supportingText', 'Confirm scheduling details.');
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('.dialog') as HTMLElement;
    expect(dialog.getAttribute('role')).toBe('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
  });

  it('emits close when Escape is pressed inside an open dialog', () => {
    const fixture = TestBed.createComponent(DialogShell);
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('headline', 'Sign out');
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('.dialog') as HTMLElement;
    dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(closed).toHaveBeenCalledOnce();
  });
});
