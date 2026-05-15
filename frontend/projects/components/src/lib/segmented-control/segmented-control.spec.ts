import { TestBed } from '@angular/core/testing';
import { SegmentedControl } from './segmented-control';

describe('SegmentedControl', () => {
  it('renders one button per option and reflects selected state', () => {
    const fixture = TestBed.createComponent(SegmentedControl);
    fixture.componentRef.setInput('options', [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ]);
    fixture.componentRef.setInput('selected', 'b');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button.segment') as NodeListOf<HTMLButtonElement>;
    expect(buttons.length).toBe(2);
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
  });

  it('emits selectedChange on click', () => {
    const fixture = TestBed.createComponent(SegmentedControl);
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'A' }]);
    fixture.detectChanges();
    let emitted: string | null = null;
    fixture.componentInstance.selectedChange.subscribe((v) => (emitted = v));
    (fixture.nativeElement.querySelector('button.segment') as HTMLButtonElement).click();
    expect(emitted).toBe('a');
  });
});
