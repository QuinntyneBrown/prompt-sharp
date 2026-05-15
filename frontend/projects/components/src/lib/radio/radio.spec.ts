import { TestBed } from '@angular/core/testing';
import { Radio } from './radio';

describe('Radio', () => {
  it('emits its value when toggled on', () => {
    const fixture = TestBed.createComponent(Radio);
    fixture.componentRef.setInput('name', 'difficulty');
    fixture.componentRef.setInput('value', 'beginner');
    fixture.detectChanges();

    let emitted: string | null = null;
    fixture.componentInstance.checkedChange.subscribe((v) => (emitted = v));

    const input = fixture.nativeElement.querySelector('input.dot') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));

    expect(emitted).toBe('beginner');
  });
});
