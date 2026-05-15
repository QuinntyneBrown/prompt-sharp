import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button, EmptyState } from 'components';

@Component({
  selector: 'ps-error-page',
  templateUrl: './error-page.html',
  styleUrl: './error-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, EmptyState],
})
export class ErrorPage {}
