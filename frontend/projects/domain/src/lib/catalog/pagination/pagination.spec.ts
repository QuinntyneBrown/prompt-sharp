import { TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(Pagination);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
