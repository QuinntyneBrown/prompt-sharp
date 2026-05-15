import { TestBed } from '@angular/core/testing';
import { AdminTaxonomyRow } from './admin-taxonomy-row';

describe('AdminTaxonomyRow', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminTaxonomyRow);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
