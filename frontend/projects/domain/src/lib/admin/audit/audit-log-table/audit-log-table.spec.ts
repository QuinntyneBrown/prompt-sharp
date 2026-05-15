import { TestBed } from '@angular/core/testing';
import { AuditLogTable } from './audit-log-table';

describe('AuditLogTable', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AuditLogTable);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
