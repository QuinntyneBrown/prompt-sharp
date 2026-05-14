import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-eyebrow',
  templateUrl: './eyebrow.html',
  styleUrl: './eyebrow.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Eyebrow {
  readonly showDot = input<boolean>(false);
}
