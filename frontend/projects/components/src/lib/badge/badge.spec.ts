import { TestBed } from '@angular/core/testing';
import { Badge } from './badge';

describe('Badge', () => {
  it('defaults to tone default and size md', () => {
    const fixture = TestBed.createComponent(Badge);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('data-tone')).toBe('default');
    expect(host.getAttribute('data-size')).toBe('md');
  });
});
