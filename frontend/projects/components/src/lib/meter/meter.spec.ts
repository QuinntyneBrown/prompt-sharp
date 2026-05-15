import { TestBed } from '@angular/core/testing';
import { Meter } from './meter';

describe('Meter', () => {
  it('exposes aria-valuenow when not indeterminate', () => {
    const fixture = TestBed.createComponent(Meter);
    fixture.componentRef.setInput('value', 40);
    fixture.componentRef.setInput('max', 100);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('progressbar');
    expect(host.getAttribute('aria-valuemax')).toBe('100');
    expect(host.getAttribute('aria-valuenow')).toBe('40');
  });

  it('drops aria-valuenow when indeterminate', () => {
    const fixture = TestBed.createComponent(Meter);
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-valuenow')).toBeNull();
  });
});
