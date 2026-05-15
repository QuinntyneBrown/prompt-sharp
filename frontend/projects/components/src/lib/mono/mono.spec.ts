import { TestBed } from '@angular/core/testing';
import { Mono } from './mono';

describe('Mono', () => {
  it('reflects size and tone defaults', () => {
    const fixture = TestBed.createComponent(Mono);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-size')).toBe('md');
    expect(host.getAttribute('data-tone')).toBe('default');
  });
});
