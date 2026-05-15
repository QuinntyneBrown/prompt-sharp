import { TestBed } from '@angular/core/testing';
import { ConfirmDeleteDialog } from './confirm-delete-dialog';

describe('ConfirmDeleteDialog', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(ConfirmDeleteDialog);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
