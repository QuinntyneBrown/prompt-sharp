import { TestBed } from '@angular/core/testing';
import { AdminTopbar } from './admin-topbar';

describe('AdminTopbar', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminTopbar);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
