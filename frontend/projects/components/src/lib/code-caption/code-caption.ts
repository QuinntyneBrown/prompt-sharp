import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-code-caption',
  templateUrl: './code-caption.html',
  styleUrl: './code-caption.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeCaption {
  readonly text = input<string | null>(null);
  readonly language = input<string | null>(null);
}
