import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-media-selection-bar',
  templateUrl: './media-selection-bar.html',
  styleUrl: './media-selection-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'region',
    'aria-label': 'Media selection',
  },
})
export class MediaSelectionBar {
  readonly bulkActioned = output<string>();
}
