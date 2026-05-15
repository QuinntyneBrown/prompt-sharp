import { TestBed } from '@angular/core/testing';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(SearchBar);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
