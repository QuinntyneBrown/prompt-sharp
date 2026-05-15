import { TestBed } from '@angular/core/testing';
import { UnsavedChangesDialog } from './unsaved-changes-dialog';

describe('UnsavedChangesDialog', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(UnsavedChangesDialog);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
