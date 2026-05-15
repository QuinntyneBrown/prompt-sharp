import { TestBed } from '@angular/core/testing';
import { SkeletonLine } from './skeleton-line';

describe('SkeletonLine', () => {
  it('applies width as percentage when a number is provided', () => {
    const fixture = TestBed.createComponent(SkeletonLine);
    fixture.componentRef.setInput('width', 60);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).style.width).toBe('60%');
  });

  it('applies width as raw CSS length when a string is provided', () => {
    const fixture = TestBed.createComponent(SkeletonLine);
    fixture.componentRef.setInput('width', '120px');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).style.width).toBe('120px');
  });

  it('reflects delay/tone/rounded host attributes', () => {
    const fixture = TestBed.createComponent(SkeletonLine);
    fixture.componentRef.setInput('delay', 2);
    fixture.componentRef.setInput('tone', 'muted');
    fixture.componentRef.setInput('rounded', true);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-delay')).toBe('2');
    expect(host.getAttribute('data-tone')).toBe('muted');
    expect(host.getAttribute('data-rounded')).toBe('true');
  });
});
