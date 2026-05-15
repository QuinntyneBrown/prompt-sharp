import { TestBed } from '@angular/core/testing';
import { Eyebrow } from './eyebrow';

describe('Eyebrow', () => {
  it('renders without dot by default', () => {
    const fixture = TestBed.createComponent(Eyebrow);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.dot')).toBeNull();
    expect((fixture.nativeElement as HTMLElement).getAttribute('data-tone')).toBe('default');
  });

  it('renders dot when showDot is true', () => {
    const fixture = TestBed.createComponent(Eyebrow);
    fixture.componentRef.setInput('showDot', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.dot')).toBeTruthy();
  });
});
