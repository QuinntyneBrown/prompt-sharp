import { TestBed } from '@angular/core/testing';
import { Breadcrumb } from './breadcrumb';

describe('Breadcrumb', () => {
  it('renders as an anchor when href provided and not current', () => {
    const fixture = TestBed.createComponent(Breadcrumb);
    fixture.componentRef.setInput('label', 'Tutorials');
    fixture.componentRef.setInput('href', '/tutorials');
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a.crumb') as HTMLAnchorElement;
    expect(anchor?.getAttribute('href')).toBe('/tutorials');
  });

  it('renders as span and sets aria-current when current', () => {
    const fixture = TestBed.createComponent(Breadcrumb);
    fixture.componentRef.setInput('label', 'Detail');
    fixture.componentRef.setInput('current', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a.crumb')).toBeNull();
    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-current')).toBe('page');
  });
});
