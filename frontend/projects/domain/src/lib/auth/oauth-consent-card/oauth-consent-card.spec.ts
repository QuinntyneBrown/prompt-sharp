import { TestBed } from '@angular/core/testing';
import { OauthConsentCard } from './oauth-consent-card';

describe('OauthConsentCard', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(OauthConsentCard);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
