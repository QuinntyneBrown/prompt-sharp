import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SignInPage } from './sign-in-page';

describe('SignInPage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap({})) },
        },
      ],
    });
    const fixture = TestBed.createComponent(SignInPage);

    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
