import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AdminTaxonomyPage } from './admin-taxonomy-page';

describe('AdminTaxonomyPage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
      ],
    });
    const fixture = TestBed.createComponent(AdminTaxonomyPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
