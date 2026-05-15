import { TestBed } from '@angular/core/testing';
import { Wordmark } from './wordmark';

describe('Wordmark', () => {
  it('renders the italic slash and default size/variant', () => {
    const fixture = TestBed.createComponent(Wordmark);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-size')).toBe('md');
    expect(host.getAttribute('data-variant')).toBe('inline');
    expect(host.getAttribute('aria-label')).toBe('Prompt/Sharp');
    expect(host.querySelector('.slash')?.textContent).toBe('/');
  });
});
