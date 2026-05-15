import { TestBed } from '@angular/core/testing';
import { Avatar } from './avatar';

describe('Avatar', () => {
  it('renders initials from name when no src', () => {
    const fixture = TestBed.createComponent(Avatar);
    fixture.componentRef.setInput('name', 'Quinntyne Brown');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.initials')?.textContent?.trim()).toBe('QB');
    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-label')).toBe('Quinntyne Brown');
  });

  it('renders img when src is set', () => {
    const fixture = TestBed.createComponent(Avatar);
    fixture.componentRef.setInput('name', 'QB');
    fixture.componentRef.setInput('src', '/qb.png');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img.img')).toBeTruthy();
  });
});
