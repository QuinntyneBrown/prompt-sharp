import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HomePage } from './home-page';

describe('HomePage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
      ],
    });
    const fixture = TestBed.createComponent(HomePage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
