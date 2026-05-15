import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AdminTutorialListPage } from './admin-tutorial-list-page';

describe('AdminTutorialListPage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
      ],
    });
    const fixture = TestBed.createComponent(AdminTutorialListPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
