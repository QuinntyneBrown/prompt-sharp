import { TestBed } from '@angular/core/testing';
import { MediaUploadDialog } from './media-upload-dialog';

describe('MediaUploadDialog', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(MediaUploadDialog);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
