import { TestBed } from '@angular/core/testing';
import { AuditLogRow } from './audit-log-row';

describe('AuditLogRow', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AuditLogRow);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
