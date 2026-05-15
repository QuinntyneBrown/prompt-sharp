import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

let nextDialogId = 0;

@Component({
  selector: 'lib-dialog-shell',
  templateUrl: './dialog-shell.html',
  styleUrl: './dialog-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
}
