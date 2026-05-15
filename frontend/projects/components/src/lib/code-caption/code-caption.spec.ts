import { TestBed } from '@angular/core/testing';
import { CodeCaption } from './code-caption';

describe('CodeCaption', () => {
  it('renders language and text', () => {
    const fixture = TestBed.createComponent(CodeCaption);
    fixture.componentRef.setInput('language', 'csharp');
    fixture.componentRef.setInput('text', 'Program.cs');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lang')?.textContent?.trim()).toBe('csharp');
    expect(fixture.nativeElement.querySelector('.text')?.textContent?.trim()).toBe('Program.cs');
  });
});
