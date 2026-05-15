import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ps-step-block-row',
  templateUrl: './step-block-row.html',
  styleUrl: './step-block-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepBlockRow {
  readonly kind = input<'prose' | 'code' | 'image' | 'callout' | null>(null);
}
