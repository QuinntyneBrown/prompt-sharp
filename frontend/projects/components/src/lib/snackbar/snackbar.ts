import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { SnackbarTone } from './snackbar-tone';

@Component({
  selector: 'lib-snackbar',
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-open]': 'open() || null',
    '[attr.data-tone]': 'tone()',
  },
})
export class Snackbar {
  readonly tone = input<SnackbarTone>('default');
  readonly message = input.required<string>();
  readonly actionLabel = input<string | null>(null);
  readonly open = input<boolean>(false);
  readonly timeout = input<number>(0);

  readonly action = output<void>();
  readonly dismissed = output<void>();

  constructor() {
    effect((onCleanup) => {
      if (!this.open() || this.timeout() <= 0) return;
      const timer = setTimeout(() => this.dismissed.emit(), this.timeout());
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected onAction(): void {
    this.action.emit();
  }

  protected onDismiss(): void {
    this.dismissed.emit();
  }
}
