import { TestBed } from '@angular/core/testing';
import { OauthConsentPage } from './oauth-consent-page';

describe('OauthConsentPage', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(OauthConsentPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
