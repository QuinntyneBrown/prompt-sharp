import { TestBed } from '@angular/core/testing';
import { CatalogHeader } from './catalog-header';

describe('CatalogHeader', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(CatalogHeader);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
