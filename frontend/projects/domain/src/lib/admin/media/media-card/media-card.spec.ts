import { TestBed } from '@angular/core/testing';
import { MediaCard } from './media-card';

describe('MediaCard', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(MediaCard);
    fixture.componentRef.setInput('filename', 'sample');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
