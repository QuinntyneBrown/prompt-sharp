import { TestBed } from '@angular/core/testing';
import { ProgressList } from './progress-list';

describe('ProgressList', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(ProgressList);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
