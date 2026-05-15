import { TestBed } from '@angular/core/testing';
import { CatalogBody } from './catalog-body';

describe('CatalogBody', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(CatalogBody);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
