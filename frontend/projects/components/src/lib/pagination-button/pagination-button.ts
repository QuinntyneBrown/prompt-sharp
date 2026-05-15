import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-pagination-button',
  templateUrl: './pagination-button.html',
  styleUrl: './pagination-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-active]': 'active() || null',
  },
})
export class PaginationButton {
  readonly label = input<string | number | null>(null);
  readonly active = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);

  readonly selected = output<void>();

  protected onClick(): void {
    if (!this.disabled()) this.selected.emit();
  }
}
