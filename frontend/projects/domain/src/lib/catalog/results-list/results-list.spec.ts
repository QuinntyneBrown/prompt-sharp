import { TestBed } from '@angular/core/testing';
import { ResultsList } from './results-list';

describe('ResultsList', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(ResultsList);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
