import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AdminShell } from './admin-shell';

describe('AdminShell', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(),
        provideHttpClientTesting(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(AdminShell);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
