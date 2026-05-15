import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { OauthCallbackPage } from './oauth-callback-page';

describe('OauthCallbackPage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(OauthCallbackPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
