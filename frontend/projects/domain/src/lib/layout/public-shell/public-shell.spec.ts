import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PublicShell } from './public-shell';

describe('PublicShell', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(),
        provideHttpClientTesting(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(PublicShell);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
