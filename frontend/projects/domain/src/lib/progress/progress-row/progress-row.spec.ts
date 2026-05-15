import { TestBed } from '@angular/core/testing';
import { ProgressRow } from './progress-row';

describe('ProgressRow', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(ProgressRow);
    fixture.componentRef.setInput('title', 'sample');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
