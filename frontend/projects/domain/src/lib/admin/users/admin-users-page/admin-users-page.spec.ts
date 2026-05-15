import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AdminUsersPage } from './admin-users-page';

describe('AdminUsersPage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
      ],
    });
    const fixture = TestBed.createComponent(AdminUsersPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
