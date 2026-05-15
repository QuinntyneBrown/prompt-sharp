import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-featured-tutorials',
  templateUrl: './featured-tutorials.html',
  styleUrl: './featured-tutorials.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedTutorials {
}
