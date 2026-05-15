import { TestBed } from '@angular/core/testing';
import { Tabs } from './tabs';

describe('Tabs', () => {
  it('renders tabs and reflects the selected tab as active', () => {
    const fixture = TestBed.createComponent(Tabs);
    fixture.componentRef.setInput('tabs', [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ]);
    fixture.componentRef.setInput('selected', 'b');
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button.tab') as NodeListOf<HTMLButtonElement>;
    expect(buttons[1].getAttribute('aria-selected')).toBe('true');
    expect(buttons[1].getAttribute('tabindex')).toBe('0');
    expect(buttons[0].getAttribute('tabindex')).toBe('-1');
  });

  it('emits selectedChange on arrow key', () => {
    const fixture = TestBed.createComponent(Tabs);
    fixture.componentRef.setInput('tabs', [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ]);
    fixture.componentRef.setInput('selected', 'a');
    fixture.detectChanges();
    let emitted: string | null = null;
    fixture.componentInstance.selectedChange.subscribe((v) => (emitted = v));
    const buttons = fixture.nativeElement.querySelectorAll('button.tab') as NodeListOf<HTMLButtonElement>;
    buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(emitted).toBe('b');
  });
});
