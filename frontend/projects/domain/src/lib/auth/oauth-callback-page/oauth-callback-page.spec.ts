import { TestBed } from '@angular/core/testing';
import { OauthCallbackPage } from './oauth-callback-page';

describe('OauthCallbackPage', () => {
  it('creates the component', () => {
    const fixture = TestBed.createComponent(OauthCallbackPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
