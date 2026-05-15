import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconButtonSize } from './icon-button-size';
import { IconButtonVariant } from './icon-button-variant';

@Component({
  selector: 'lib-icon-button',
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-pressed]': 'pressed() === null ? null : pressed()',
  },
})
export class IconButton {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly variant = input<IconButtonVariant>('standard');
  readonly size = input<IconButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly pressed = input<boolean | null>(null);

  readonly clicked = output<MouseEvent>();
  readonly pressedChange = output<boolean>();

  protected onClick(event: MouseEvent): void {
    if (this.disabled()) return;
    if (this.pressed() !== null) this.pressedChange.emit(!this.pressed());
    this.clicked.emit(event);
  }
}
