import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-media-grid',
  templateUrl: './media-grid.html',
  styleUrl: './media-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaGrid {
}
