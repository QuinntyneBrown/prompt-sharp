import { TestBed } from '@angular/core/testing';
import { StepOutline } from './step-outline';

describe('StepOutline', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(StepOutline);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
