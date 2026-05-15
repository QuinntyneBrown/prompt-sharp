import { TestBed } from '@angular/core/testing';
import { Switch } from './switch';

describe('Switch', () => {
  it('toggles state on click and emits new value', () => {
    const fixture = TestBed.createComponent(Switch);
    fixture.detectChanges();
    let emitted: boolean | null = null;
    fixture.componentInstance.checkedChange.subscribe((v) => (emitted = v));

    (fixture.nativeElement.querySelector('button.track') as HTMLButtonElement).click();
    expect(emitted).toBe(true);
  });

  it('reflects aria-checked from the checked input', () => {
    const fixture = TestBed.createComponent(Switch);
    fixture.componentRef.setInput('checked', true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button.track') as HTMLButtonElement;
    expect(button.getAttribute('aria-checked')).toBe('true');
  });
});
