import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CodeCaption } from 'components';

@Component({
  selector: 'ps-tutorial-code-block',
  templateUrl: './tutorial-code-block.html',
  styleUrl: './tutorial-code-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CodeCaption],
})
export class TutorialCodeBlock {
  readonly language = input<string | null>(null);
  readonly code = input.required<string>();
}
