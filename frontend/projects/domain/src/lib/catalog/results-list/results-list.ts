import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-results-list',
  templateUrl: './results-list.html',
  styleUrl: './results-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsList {
}
