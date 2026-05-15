import { TestBed } from '@angular/core/testing';
import { AuditFilterRail } from './audit-filter-rail';

describe('AuditFilterRail', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AuditFilterRail);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
