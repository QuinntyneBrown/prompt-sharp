import { TestBed } from '@angular/core/testing';
import { PublishDialog } from './publish-dialog';

describe('PublishDialog', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(PublishDialog);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
