import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-category-dialog',
  templateUrl: './category-dialog.html',
  styleUrl: './category-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDialog {
  readonly submitted = output<unknown>();
  readonly cancelled = output<void>();
}
