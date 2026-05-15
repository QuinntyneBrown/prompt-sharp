import { TestBed } from '@angular/core/testing';
import { IconButton } from './icon-button';

describe('IconButton', () => {
  it('requires an accessible label and icon', () => {
    const fixture = TestBed.createComponent(IconButton);
    fixture.componentRef.setInput('icon', 'close');
    fixture.componentRef.setInput('label', 'Close dialog');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Close dialog');
    expect(button.textContent?.trim()).toBe('close');
  });

  it('reflects pressed state and emits pressedChange', () => {
    const fixture = TestBed.createComponent(IconButton);
    fixture.componentRef.setInput('icon', 'star');
    fixture.componentRef.setInput('label', 'Pin');
    fixture.componentRef.setInput('pressed', false);
    fixture.detectChanges();

    let emitted: boolean | null = null;
    fixture.componentInstance.pressedChange.subscribe((value) => (emitted = value));
    fixture.nativeElement.querySelector('button').click();

    expect(emitted).toBe(true);
    expect(fixture.nativeElement.getAttribute('data-pressed')).toBe('false');
    expect(fixture.nativeElement.querySelector('button').getAttribute('aria-pressed')).toBe('false');
  });
});
