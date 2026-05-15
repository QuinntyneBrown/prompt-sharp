import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-admin-activity-list',
  templateUrl: './admin-activity-list.html',
  styleUrl: './admin-activity-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminActivityList {
}
