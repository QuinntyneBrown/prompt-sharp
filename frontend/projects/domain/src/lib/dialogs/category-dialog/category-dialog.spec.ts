import { TestBed } from '@angular/core/testing';
import { CategoryDialog } from './category-dialog';

describe('CategoryDialog', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(CategoryDialog);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
