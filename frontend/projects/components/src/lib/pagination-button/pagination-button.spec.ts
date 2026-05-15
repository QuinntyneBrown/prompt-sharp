import { TestBed } from '@angular/core/testing';
import { PaginationButton } from './pagination-button';

describe('PaginationButton', () => {
  it('reflects active page accessibility state', () => {
    const fixture = TestBed.createComponent(PaginationButton);
    fixture.componentRef.setInput('label', 2);
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-current')).toBe('page');
    expect(fixture.nativeElement.getAttribute('data-active')).toBe('true');
  });

  it('emits selected on click', () => {
    const fixture = TestBed.createComponent(PaginationButton);
    fixture.detectChanges();

    let count = 0;
    fixture.componentInstance.selected.subscribe(() => count++);
    fixture.nativeElement.querySelector('button').click();

    expect(count).toBe(1);
  });
});
