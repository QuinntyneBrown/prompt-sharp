import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Meter } from 'components';

@Component({
  selector: 'ps-progress-row',
  templateUrl: './progress-row.html',
  styleUrl: './progress-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Meter],
})
export class ProgressRow {
  readonly title = input.required<string>();
  readonly percent = input<number>(0);
}
