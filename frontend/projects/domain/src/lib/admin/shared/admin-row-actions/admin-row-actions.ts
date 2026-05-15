import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-admin-row-actions',
  templateUrl: './admin-row-actions.html',
  styleUrl: './admin-row-actions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRowActions {
  readonly edit = output<void>();
  readonly remove = output<void>();
}
