import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CatalogPage } from './catalog-page';

describe('CatalogPage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
      ],
    });
    const fixture = TestBed.createComponent(CatalogPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
