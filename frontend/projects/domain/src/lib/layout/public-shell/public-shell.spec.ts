import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PublicShell } from './public-shell';

describe('PublicShell', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([])],
    });
    const fixture = TestBed.createComponent(PublicShell);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
