import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FabVariant } from './fab-variant';

@Component({
  selector: 'lib-fab',
  templateUrl: './fab.html',
  styleUrl: './fab.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-extended]': 'extended() || null',
  },
})
export class Fab {
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly variant = input<FabVariant>('primary');
  readonly extended = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly clicked = output<MouseEvent>();

  protected onClick(event: MouseEvent): void {
    if (!this.disabled()) this.clicked.emit(event);
  }
}
