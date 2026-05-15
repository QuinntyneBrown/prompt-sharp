import { TestBed } from '@angular/core/testing';
import { StepOutlineItem } from './step-outline-item';

describe('StepOutlineItem', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(StepOutlineItem);
    fixture.componentRef.setInput('title', 'sample');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
