import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-swatch',
  templateUrl: './swatch.html',
  styleUrl: './swatch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-selected]': 'selected() || null',
  },
})
export class Swatch {
  readonly color = input.required<string>();
  readonly selected = input<boolean>(false);
  readonly label = input<string | null>(null);
  readonly disabled = input<boolean>(false);

  readonly selectedChange = output<string>();

  protected onClick(): void {
    if (this.disabled()) return;
    this.selectedChange.emit(this.color());
  }
}
