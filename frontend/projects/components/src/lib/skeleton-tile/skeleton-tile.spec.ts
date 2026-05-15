import { TestBed } from '@angular/core/testing';
import { SkeletonTile } from './skeleton-tile';

describe('SkeletonTile', () => {
  it('applies default aspect ratio and radius', () => {
    const fixture = TestBed.createComponent(SkeletonTile);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.style.aspectRatio.replace(/\s/g, '')).toBe('4/3');
    expect(host.getAttribute('data-radius')).toBe('none');
  });
});
