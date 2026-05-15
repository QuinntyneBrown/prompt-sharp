import { TestBed } from '@angular/core/testing';
import { Stat } from './stat';

describe('Stat', () => {
  it('renders value, label, supporting and reflects tone/trend', () => {
    const fixture = TestBed.createComponent(Stat);
    fixture.componentRef.setInput('value', '412');
    fixture.componentRef.setInput('label', 'Tutorials');
    fixture.componentRef.setInput('supportingLabel', '+12 this week');
    fixture.componentRef.setInput('tone', 'accent');
    fixture.componentRef.setInput('trend', 'up');
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.value')?.textContent).toContain('412');
    expect(host.querySelector('.label')?.textContent).toContain('Tutorials');
    expect(host.querySelector('.supporting')?.textContent).toContain('+12 this week');
    expect(host.getAttribute('data-tone')).toBe('accent');
    expect(host.getAttribute('data-trend')).toBe('up');
  });
});
