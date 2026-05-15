import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-admin-tutorial-row',
  templateUrl: './admin-tutorial-row.html',
  styleUrl: './admin-tutorial-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTutorialRow {
  readonly edit = output<void>();
  readonly remove = output<void>();
}
