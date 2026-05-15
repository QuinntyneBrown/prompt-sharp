import { TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders display and description text', () => {
    const fixture = TestBed.createComponent(EmptyState);
    fixture.componentRef.setInput('display', 'Nothing here');
    fixture.componentRef.setInput('description', 'Try another search.');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.title')?.textContent?.trim()).toBe('Nothing here');
    expect(fixture.nativeElement.querySelector('.description')?.textContent?.trim()).toBe('Try another search.');
  });
});
