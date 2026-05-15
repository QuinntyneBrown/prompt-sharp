import { TestBed } from '@angular/core/testing';
import { AdminKpiCard } from './admin-kpi-card';

describe('AdminKpiCard', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminKpiCard);
    fixture.componentRef.setInput('label', 'sample');
    fixture.componentRef.setInput('value', 'sample');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
