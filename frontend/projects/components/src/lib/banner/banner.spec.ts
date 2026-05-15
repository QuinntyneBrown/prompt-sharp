import { TestBed } from '@angular/core/testing';
import { Banner } from './banner';

describe('Banner', () => {
  it('uses alert role for danger tone', () => {
    const fixture = TestBed.createComponent(Banner);
    fixture.componentRef.setInput('tone', 'danger');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.banner').getAttribute('role')).toBe('alert');
  });

  it('renders optional icon', () => {
    const fixture = TestBed.createComponent(Banner);
    fixture.componentRef.setInput('icon', 'info');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.icon')?.textContent?.trim()).toBe('info');
  });
});
