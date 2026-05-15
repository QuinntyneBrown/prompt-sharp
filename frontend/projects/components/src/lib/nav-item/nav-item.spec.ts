import { TestBed } from '@angular/core/testing';
import { NavItem } from './nav-item';

describe('NavItem', () => {
  it('renders an anchor when href is provided', () => {
    const fixture = TestBed.createComponent(NavItem);
    fixture.componentRef.setInput('label', 'Catalog');
    fixture.componentRef.setInput('href', '/catalog');
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();

    const anchor = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(anchor.getAttribute('href')).toBe('/catalog');
    expect(anchor.getAttribute('aria-current')).toBe('page');
  });

  it('uses aria-label when collapsed', () => {
    const fixture = TestBed.createComponent(NavItem);
    fixture.componentRef.setInput('label', 'Dashboard');
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.item').getAttribute('aria-label')).toBe('Dashboard');
    expect(fixture.nativeElement.getAttribute('data-collapsed')).toBe('true');
  });
});
