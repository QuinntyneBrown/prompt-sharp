import { TestBed } from '@angular/core/testing';
import { SearchField } from './search-field';

describe('SearchField', () => {
  it('emits searched on Enter key', () => {
    const fixture = TestBed.createComponent(SearchField);
    fixture.componentRef.setInput('value', 'azure');
    fixture.detectChanges();
    let emitted: string | null = null;
    fixture.componentInstance.searched.subscribe((v) => (emitted = v));
    const input = fixture.nativeElement.querySelector('input.input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(emitted).toBe('azure');
  });

  it('emits cleared and empty valueChange when clear button clicked', () => {
    const fixture = TestBed.createComponent(SearchField);
    fixture.componentRef.setInput('value', 'azure');
    fixture.detectChanges();
    let cleared = false;
    let value: string | null = null;
    fixture.componentInstance.cleared.subscribe(() => (cleared = true));
    fixture.componentInstance.valueChange.subscribe((v) => (value = v));
    (fixture.nativeElement.querySelector('button.clear') as HTMLButtonElement).click();
    expect(cleared).toBe(true);
    expect(value).toBe('');
  });
});
