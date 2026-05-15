import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-related-tutorials',
  templateUrl: './related-tutorials.html',
  styleUrl: './related-tutorials.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelatedTutorials {
}
