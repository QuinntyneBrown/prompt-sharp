import { TestBed } from '@angular/core/testing';
import { PublicDialogBackdrop } from './public-dialog-backdrop';

describe('PublicDialogBackdrop', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(PublicDialogBackdrop);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
