import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-admin-tutorial-table',
  templateUrl: './admin-tutorial-table.html',
  styleUrl: './admin-tutorial-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTutorialTable {
}
