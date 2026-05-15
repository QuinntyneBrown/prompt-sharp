import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell } from 'components';

@Component({
  selector: 'ps-tutorial-dialog',
  templateUrl: './tutorial-dialog.html',
  styleUrl: './tutorial-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell],
})
export class TutorialDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly submitted = output<unknown>();
}
