import { TestBed } from '@angular/core/testing';
import { DropZone } from './drop-zone';

describe('DropZone', () => {
  it('passes accept and multiple to the file input', () => {
    const fixture = TestBed.createComponent(DropZone);
    fixture.componentRef.setInput('accept', 'image/*');
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('accept')).toBe('image/*');
    expect(input.multiple).toBe(true);
  });

  it('reflects drag active state', () => {
    const fixture = TestBed.createComponent(DropZone);
    fixture.detectChanges();

    const zone = fixture.nativeElement.querySelector('.zone') as HTMLElement;
    zone.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('data-drag-active')).toBe('true');
  });
});
