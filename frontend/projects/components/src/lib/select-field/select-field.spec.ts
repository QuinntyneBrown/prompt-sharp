import { TestBed } from '@angular/core/testing';
import { SelectField } from './select-field';

describe('SelectField', () => {
  it('renders options and emits valueChange', () => {
    const fixture = TestBed.createComponent(SelectField);
    fixture.componentRef.setInput('options', [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ]);
    fixture.detectChanges();

    let emitted: string | null = null;
    fixture.componentInstance.valueChange.subscribe((v) => (emitted = v));

    const select = fixture.nativeElement.querySelector('select.select') as HTMLSelectElement;
    expect(select.options.length).toBe(2);

    select.value = 'b';
    select.dispatchEvent(new Event('change'));
    expect(emitted).toBe('b');
  });
});
