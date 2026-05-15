import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminShell } from './admin-shell';

describe('AdminShell', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
