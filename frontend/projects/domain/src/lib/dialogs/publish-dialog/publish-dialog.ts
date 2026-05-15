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
  readonly headline = input<string>('Publish tutorial?');
  readonly supportingText = input<string>('Make this tutorial visible to all readers.');
  readonly cancelled = output<void>();
  readonly submitted = output<void>();
}
