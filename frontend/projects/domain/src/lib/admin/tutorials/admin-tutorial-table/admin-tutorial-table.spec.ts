import { TestBed } from '@angular/core/testing';
import { AdminTutorialTable } from './admin-tutorial-table';

describe('AdminTutorialTable', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminTutorialTable);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
