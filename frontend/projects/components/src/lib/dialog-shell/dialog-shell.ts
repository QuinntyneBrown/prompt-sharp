import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';

let nextDialogId = 0;

@Component({
  selector: 'lib-dialog-shell',
  templateUrl: './dialog-shell.html',
  styleUrl: './dialog-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkTrapFocus],
  host: {
    '[attr.data-open]': 'open() || null',
    '[attr.data-modal]': 'modal()',
  },
})
export class DialogShell {
  readonly open = input<boolean>(false);
  readonly headline = input<string | null>(null);
  readonly supportingText = input<string | null>(null);
  readonly modal = input<boolean>(true);

  readonly closed = output<void>();

  protected readonly titleId = `lib-dialog-title-${nextDialogId}`;
  protected readonly descriptionId = `lib-dialog-description-${nextDialogId++}`;

  protected onScrimClick(): void {
    this.closed.emit();
  }

  protected onEscape(event: Event): void {
    event.stopPropagation();
    this.closed.emit();
  }
}
