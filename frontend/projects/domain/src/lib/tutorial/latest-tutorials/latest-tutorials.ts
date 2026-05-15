import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-latest-tutorials',
  templateUrl: './latest-tutorials.html',
  styleUrl: './latest-tutorials.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestTutorials {
}
