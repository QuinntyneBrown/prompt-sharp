import { TestBed } from '@angular/core/testing';
import { TextArea } from './text-area';

describe('TextArea', () => {
  it('emits valueChange on input', () => {
    const fixture = TestBed.createComponent(TextArea);
    fixture.detectChanges();
    let emitted: string | null = null;
    fixture.componentInstance.valueChange.subscribe((v) => (emitted = v));

    const ta = fixture.nativeElement.querySelector('textarea.field') as HTMLTextAreaElement;
    ta.value = 'long text';
    ta.dispatchEvent(new Event('input'));

    expect(emitted).toBe('long text');
  });
});
