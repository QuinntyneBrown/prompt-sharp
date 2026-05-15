import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ps-step-outline-item',
  templateUrl: './step-outline-item.html',
  styleUrl: './step-outline-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepOutlineItem {
  readonly title = input.required<string>();
}
