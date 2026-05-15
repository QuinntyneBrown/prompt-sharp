import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminAuditLogPage } from './admin-audit-log-page';

describe('AdminAuditLogPage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const fixture = TestBed.createComponent(AdminAuditLogPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
