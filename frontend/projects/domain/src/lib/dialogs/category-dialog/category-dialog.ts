import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, DialogShell, TextField } from 'components';

@Component({
  selector: 'ps-category-dialog',
  templateUrl: './category-dialog.html',
  styleUrl: './category-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell, TextField],
})
export class CategoryDialog {
  readonly open = input<boolean>(false);
  readonly cancelled = output<void>();
  readonly submitted = output<unknown>();
}
