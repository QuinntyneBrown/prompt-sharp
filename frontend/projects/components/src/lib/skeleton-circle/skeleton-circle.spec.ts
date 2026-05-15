import { TestBed } from '@angular/core/testing';
import { SkeletonCircle } from './skeleton-circle';

describe('SkeletonCircle', () => {
  it('defaults to size md', () => {
    const fixture = TestBed.createComponent(SkeletonCircle);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).getAttribute('data-size')).toBe('md');
  });
});
