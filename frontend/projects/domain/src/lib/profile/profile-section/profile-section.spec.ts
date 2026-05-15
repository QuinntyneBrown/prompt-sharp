import { TestBed } from '@angular/core/testing';
import { ProfileSection } from './profile-section';

describe('ProfileSection', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(ProfileSection);
    fixture.componentRef.setInput('heading', 'sample');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
