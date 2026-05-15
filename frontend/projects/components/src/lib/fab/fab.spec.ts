import { TestBed } from '@angular/core/testing';
import { Fab } from './fab';

describe('Fab', () => {
  it('uses aria-label when compact', () => {
    const fixture = TestBed.createComponent(Fab);
    fixture.componentRef.setInput('icon', 'add');
    fixture.componentRef.setInput('label', 'Create');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Create');
  });

  it('renders visible label when extended', () => {
    const fixture = TestBed.createComponent(Fab);
    fixture.componentRef.setInput('icon', 'upload');
    fixture.componentRef.setInput('label', 'Upload media');
    fixture.componentRef.setInput('extended', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('data-extended')).toBe('true');
    expect(fixture.nativeElement.querySelector('.label')?.textContent?.trim()).toBe('Upload media');
  });
});
