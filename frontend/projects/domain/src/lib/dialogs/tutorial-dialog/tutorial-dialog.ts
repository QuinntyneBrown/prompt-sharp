import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-tutorial-dialog',
  templateUrl: './tutorial-dialog.html',
  styleUrl: './tutorial-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialDialog {
  readonly submitted = output<unknown>();
  readonly cancelled = output<void>();
}
