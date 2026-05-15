import { TestBed } from '@angular/core/testing';
import { Thumbnail } from './thumbnail';

describe('Thumbnail', () => {
  it('renders skeleton placeholder when no src', () => {
    const fixture = TestBed.createComponent(Thumbnail);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img.img')).toBeNull();
    expect(fixture.nativeElement.querySelector('lib-skeleton-tile')).toBeTruthy();
  });

  it('renders img when src is provided', () => {
    const fixture = TestBed.createComponent(Thumbnail);
    fixture.componentRef.setInput('src', '/x.png');
    fixture.componentRef.setInput('alt', 'X');
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img.img') as HTMLImageElement;
    expect(img?.getAttribute('alt')).toBe('X');
  });
});
