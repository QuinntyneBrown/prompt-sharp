import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminDashboardPage } from './admin-dashboard-page';

describe('AdminDashboardPage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const fixture = TestBed.createComponent(AdminDashboardPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
