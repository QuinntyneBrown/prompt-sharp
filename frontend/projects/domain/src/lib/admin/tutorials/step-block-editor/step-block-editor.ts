import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-step-block-editor',
  templateUrl: './step-block-editor.html',
  styleUrl: './step-block-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepBlockEditor {
}
