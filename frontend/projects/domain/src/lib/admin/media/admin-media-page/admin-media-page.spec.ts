import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AdminMediaPage } from './admin-media-page';

describe('AdminMediaPage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
      ],
    });
    const fixture = TestBed.createComponent(AdminMediaPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
