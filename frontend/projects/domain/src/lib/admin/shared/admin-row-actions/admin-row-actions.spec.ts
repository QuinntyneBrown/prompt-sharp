import { TestBed } from '@angular/core/testing';
import { AdminRowActions } from './admin-row-actions';

describe('AdminRowActions', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminRowActions);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
