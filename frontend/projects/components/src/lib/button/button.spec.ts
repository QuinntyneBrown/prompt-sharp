import { TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  it('reflects defaults on host attributes', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-variant')).toBe('outline');
    expect(host.getAttribute('data-size')).toBe('md');
    expect(host.getAttribute('data-loading')).toBeNull();
    expect(host.getAttribute('data-full-width')).toBeNull();
  });

  it('disables the inner button while loading and exposes aria-busy', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('forwards type and aria-label', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('type', 'submit');
    fixture.componentRef.setInput('ariaLabel', 'Save changes');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.type).toBe('submit');
    expect(button.getAttribute('aria-label')).toBe('Save changes');
  });

  it('renders icon inputs', () => {
    const fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('iconStart', 'save');
    fixture.componentRef.setInput('iconEnd', 'arrow_forward');
    fixture.detectChanges();

    const icons = fixture.nativeElement.querySelectorAll('.material-symbols-outlined') as NodeListOf<HTMLElement>;
    expect(icons[0].textContent?.trim()).toBe('save');
    expect(icons[1].textContent?.trim()).toBe('arrow_forward');
  });
});
