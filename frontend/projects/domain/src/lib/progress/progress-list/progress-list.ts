import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-progress-list',
  templateUrl: './progress-list.html',
  styleUrl: './progress-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressList {
}
