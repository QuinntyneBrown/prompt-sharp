import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PublicNav } from '../../layout/public-nav/public-nav';

@Component({
  selector: 'ps-error-page',
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PublicNav],
})
export class ErrorPage {
  protected readonly path = signal<string>(
    typeof location === 'undefined' ? '/tutorials/missing-step' : location.pathname,
  );
}
