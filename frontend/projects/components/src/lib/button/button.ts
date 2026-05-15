import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonSize } from './button-size';
import { ButtonType } from './button-type';
import { ButtonVariant } from './button-variant';

@Component({
  selector: 'lib-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.data-loading]': 'loading() || null',
    '[attr.data-full-width]': 'fullWidth() || null',
  },
})
export class Button {
  readonly variant = input<ButtonVariant>('outline');
  readonly size = input<ButtonSize>('md');
  readonly type = input<ButtonType>('button');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly ariaLabel = input<string | null>(null);
  readonly iconStart = input<string | null>(null);
  readonly iconEnd = input<string | null>(null);
}
