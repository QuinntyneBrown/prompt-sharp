import { TestBed } from '@angular/core/testing';
import { TextField } from './text-field';

describe('TextField', () => {
  it('emits valueChange when input fires', () => {
    const fixture = TestBed.createComponent(TextField);
    fixture.detectChanges();

    let emitted: string | null = null;
    fixture.componentInstance.valueChange.subscribe((v) => (emitted = v));

    const input = fixture.nativeElement.querySelector('input.input') as HTMLInputElement;
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));

    expect(emitted).toBe('hello');
  });

  it('sets aria-invalid when error is set', () => {
    const fixture = TestBed.createComponent(TextField);
    fixture.componentRef.setInput('error', 'Required');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input.input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(fixture.nativeElement.querySelector('.error')?.textContent?.trim()).toBe('Required');
  });

  it('renders prefix and suffix inputs', () => {
    const fixture = TestBed.createComponent(TextField);
    fixture.componentRef.setInput('prefix', '$');
    fixture.componentRef.setInput('suffix', 'USD');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.prefix')?.textContent?.trim()).toBe('$');
    expect(fixture.nativeElement.querySelector('.suffix')?.textContent?.trim()).toBe('USD');
  });
});
