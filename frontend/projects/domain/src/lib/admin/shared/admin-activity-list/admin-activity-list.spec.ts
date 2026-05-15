import { TestBed } from '@angular/core/testing';
import { AdminActivityList } from './admin-activity-list';

describe('AdminActivityList', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminActivityList);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
