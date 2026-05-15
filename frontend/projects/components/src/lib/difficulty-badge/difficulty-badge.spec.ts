import { TestBed } from '@angular/core/testing';
import { DifficultyBadge } from './difficulty-badge';

describe('DifficultyBadge', () => {
  it('uppercases the level label', () => {
    const fixture = TestBed.createComponent(DifficultyBadge);
    fixture.componentRef.setInput('level', 'beginner');
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('.badge')?.textContent?.trim();
    expect(text).toBe('BEGINNER');
    expect((fixture.nativeElement as HTMLElement).getAttribute('data-level')).toBe('beginner');
    expect((fixture.nativeElement as HTMLElement).getAttribute('data-density')).toBe('default');
  });

  it('reflects compact density', () => {
    const fixture = TestBed.createComponent(DifficultyBadge);
    fixture.componentRef.setInput('level', 'advanced');
    fixture.componentRef.setInput('density', 'compact');
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).getAttribute('data-density')).toBe('compact');
  });
});
