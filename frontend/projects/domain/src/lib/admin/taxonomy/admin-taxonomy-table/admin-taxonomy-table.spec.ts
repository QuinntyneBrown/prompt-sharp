import { TestBed } from '@angular/core/testing';
import { AdminTaxonomyTable } from './admin-taxonomy-table';

describe('AdminTaxonomyTable', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminTaxonomyTable);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
