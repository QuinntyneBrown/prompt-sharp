import { TestBed } from '@angular/core/testing';
import { AdminTutorialListMini } from './admin-tutorial-list-mini';

describe('AdminTutorialListMini', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(AdminTutorialListMini);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
