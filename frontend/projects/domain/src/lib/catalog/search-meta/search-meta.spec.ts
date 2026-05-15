import { TestBed } from '@angular/core/testing';
import { SearchMeta } from './search-meta';

describe('SearchMeta', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(SearchMeta);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
