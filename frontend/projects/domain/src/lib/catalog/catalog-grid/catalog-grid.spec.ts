import { TestBed } from '@angular/core/testing';
import { CatalogGrid } from './catalog-grid';

describe('CatalogGrid', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(CatalogGrid);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
