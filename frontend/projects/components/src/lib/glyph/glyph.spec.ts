import { TestBed } from '@angular/core/testing';
import { Glyph } from './glyph';

describe('Glyph', () => {
  it('is decorative by default and aria-hidden', () => {
    const fixture = TestBed.createComponent(Glyph);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.getAttribute('role')).toBeNull();
  });

  it('renders a Material Symbols span when name is provided', () => {
    const fixture = TestBed.createComponent(Glyph);
    fixture.componentRef.setInput('name', 'check');
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.material-symbols-outlined');
    expect(span?.textContent?.trim()).toBe('check');
  });

  it('exposes role=img and aria-label when not decorative', () => {
    const fixture = TestBed.createComponent(Glyph);
    fixture.componentRef.setInput('decorative', false);
    fixture.componentRef.setInput('label', 'Search');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toBe('Search');
  });
});
