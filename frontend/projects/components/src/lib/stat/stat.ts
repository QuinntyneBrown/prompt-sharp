import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-stat',
  templateUrl: './stat.html',
  styleUrl: './stat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stat {
  readonly value = input.required<string | number>();
  readonly label = input.required<string>();
}
