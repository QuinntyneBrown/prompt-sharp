import { TestBed } from '@angular/core/testing';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('emits checkedChange on change', () => {
    const fixture = TestBed.createComponent(Checkbox);
    fixture.detectChanges();
    let emitted: boolean | null = null;
    fixture.componentInstance.checkedChange.subscribe((v) => (emitted = v));

    const input = fixture.nativeElement.querySelector('input.box') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(emitted).toBe(true);
  });

  it('applies indeterminate state to the input element', () => {
    const fixture = TestBed.createComponent(Checkbox);
    fixture.componentRef.setInput('indeterminate', true);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input.box') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });
});
