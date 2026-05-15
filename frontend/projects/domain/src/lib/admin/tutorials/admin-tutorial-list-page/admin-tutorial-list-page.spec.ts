import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminTutorialListPage } from './admin-tutorial-list-page';

describe('AdminTutorialListPage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const fixture = TestBed.createComponent(AdminTutorialListPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
