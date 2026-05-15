import { TestBed } from '@angular/core/testing';
import { Swatch } from './swatch';

describe('Swatch', () => {
  it('emits the color on click', () => {
    const fixture = TestBed.createComponent(Swatch);
    fixture.componentRef.setInput('color', '#FF9800');
    fixture.detectChanges();
    let emitted: string | null = null;
    fixture.componentInstance.selectedChange.subscribe((c) => (emitted = c));
    (fixture.nativeElement.querySelector('button.swatch') as HTMLButtonElement).click();
    expect(emitted).toBe('#FF9800');
  });

  it('reflects aria-pressed when selected', () => {
    const fixture = TestBed.createComponent(Swatch);
    fixture.componentRef.setInput('color', '#000');
    fixture.componentRef.setInput('selected', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button.swatch')?.getAttribute('aria-pressed')).toBe('true');
  });
});
