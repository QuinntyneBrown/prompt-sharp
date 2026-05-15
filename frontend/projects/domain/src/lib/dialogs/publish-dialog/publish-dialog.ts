import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-publish-dialog',
  templateUrl: './publish-dialog.html',
  styleUrl: './publish-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class PublishDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly submitted = output<unknown>();
}
