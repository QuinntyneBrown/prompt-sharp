import { TestBed } from '@angular/core/testing';
import { TutorialBreadcrumbs } from './tutorial-breadcrumbs';

describe('TutorialBreadcrumbs', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(TutorialBreadcrumbs);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
