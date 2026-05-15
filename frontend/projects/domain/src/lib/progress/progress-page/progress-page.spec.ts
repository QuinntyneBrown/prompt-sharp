import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ProgressPage } from './progress-page';

describe('ProgressPage', () => {
  it('creates the component', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
      ],
    });
    const fixture = TestBed.createComponent(ProgressPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
