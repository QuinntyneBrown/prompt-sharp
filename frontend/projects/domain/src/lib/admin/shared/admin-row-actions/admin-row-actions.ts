import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { IconButton } from 'components';

@Component({
  selector: 'ps-admin-row-actions',
  templateUrl: './admin-row-actions.html',
  styleUrl: './admin-row-actions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButton],
})
export class AdminRowActions {
  readonly edit = output<void>();
  readonly remove = output<void>();
}
