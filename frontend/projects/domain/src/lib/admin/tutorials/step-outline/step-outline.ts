import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-step-outline',
  templateUrl: './step-outline.html',
  styleUrl: './step-outline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepOutline {
}
