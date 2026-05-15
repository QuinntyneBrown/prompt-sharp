import { TestBed } from '@angular/core/testing';
import { AccessDeniedPage } from './access-denied-page';

describe('AccessDeniedPage', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AccessDeniedPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
