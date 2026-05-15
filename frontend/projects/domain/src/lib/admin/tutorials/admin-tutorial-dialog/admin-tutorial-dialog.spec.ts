import { TestBed } from '@angular/core/testing';
import { AdminTutorialDialog } from './admin-tutorial-dialog';

describe('AdminTutorialDialog', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminTutorialDialog);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
