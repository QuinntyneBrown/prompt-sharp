import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-nav-item',
  templateUrl: './nav-item.html',
  styleUrl: './nav-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-active]': 'active() || null',
    '[attr.data-collapsed]': 'collapsed() || null',
    '[attr.data-disabled]': 'disabled() || null',
  },
})
export class NavItem {
  readonly icon = input<string | null>(null);
  readonly label = input.required<string>();
  readonly href = input<string | null>(null);
  readonly active = input<boolean>(false);
  readonly collapsed = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly selected = output<void>();

  protected onClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.selected.emit();
  }
}
