import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-error-page',
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPage {
}
