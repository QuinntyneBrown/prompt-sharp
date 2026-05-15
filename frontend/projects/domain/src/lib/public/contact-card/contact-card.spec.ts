import { TestBed } from '@angular/core/testing';
import { ContactCard } from './contact-card';

describe('ContactCard', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(ContactCard);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
