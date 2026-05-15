import { TestBed } from '@angular/core/testing';
import { Surface } from './surface';

describe('Surface', () => {
  it('reflects default tone/radius/padding/bordered', () => {
    const fixture = TestBed.createComponent(Surface);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-tone')).toBe('surface');
    expect(host.getAttribute('data-radius')).toBe('none');
    expect(host.getAttribute('data-padding')).toBe('md');
    expect(host.getAttribute('data-bordered')).toBe('true');
  });
});
