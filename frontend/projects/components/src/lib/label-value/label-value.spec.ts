import { TestBed } from '@angular/core/testing';
import { LabelValue } from './label-value';

describe('LabelValue', () => {
  it('renders label and value', () => {
    const fixture = TestBed.createComponent(LabelValue);
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('value', 'qb@example.com');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.label')?.textContent?.trim()).toBe('Email');
    expect(fixture.nativeElement.querySelector('.value')?.textContent?.trim()).toBe('qb@example.com');
    expect((fixture.nativeElement as HTMLElement).getAttribute('data-orientation')).toBe('horizontal');
  });
});
