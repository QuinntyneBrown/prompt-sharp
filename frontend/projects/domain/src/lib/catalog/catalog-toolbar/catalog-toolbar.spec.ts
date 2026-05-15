import { TestBed } from '@angular/core/testing';
import { CatalogToolbar } from './catalog-toolbar';

describe('CatalogToolbar', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(CatalogToolbar);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
