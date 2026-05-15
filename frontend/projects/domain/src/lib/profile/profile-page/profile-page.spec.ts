import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile-page';

describe('ProfilePage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const fixture = TestBed.createComponent(ProfilePage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
