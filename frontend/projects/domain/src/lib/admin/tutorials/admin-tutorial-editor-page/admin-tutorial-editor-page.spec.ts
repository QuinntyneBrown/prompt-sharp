import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { AdminTutorialEditorPage } from './admin-tutorial-editor-page';

describe('AdminTutorialEditorPage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
              queryParamMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    const fixture = TestBed.createComponent(AdminTutorialEditorPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
