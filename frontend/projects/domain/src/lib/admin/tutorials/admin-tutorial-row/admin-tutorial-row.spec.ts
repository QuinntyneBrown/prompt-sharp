import { TestBed } from '@angular/core/testing';
import { AdminTutorialRow } from './admin-tutorial-row';

describe('AdminTutorialRow', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminTutorialRow);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
