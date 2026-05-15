import { TestBed } from '@angular/core/testing';
import { Chip } from './chip';

describe('Chip', () => {
  it('reflects defaults', () => {
    const fixture = TestBed.createComponent(Chip);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-variant')).toBe('default');
    expect(host.getAttribute('data-selected')).toBeNull();
    expect(host.getAttribute('data-disabled')).toBeNull();
  });

  it('renders the remove button only when removable', () => {
    const fixture = TestBed.createComponent(Chip);
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button.remove')).toBeTruthy();
  });

  it('emits removed on remove click', () => {
    const fixture = TestBed.createComponent(Chip);
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();

    let count = 0;
    fixture.componentInstance.removed.subscribe(() => count++);

    const button = fixture.nativeElement.querySelector('button.remove') as HTMLButtonElement;
    button.click();
    expect(count).toBe(1);
  });
});
