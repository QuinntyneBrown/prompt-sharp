import { TestBed } from '@angular/core/testing';
import { AdminAuditLogPage } from './admin-audit-log-page';

describe('AdminAuditLogPage', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminAuditLogPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
