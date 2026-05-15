import { TestBed } from '@angular/core/testing';
import { StepBlockRow } from './step-block-row';

describe('StepBlockRow', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(StepBlockRow);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
