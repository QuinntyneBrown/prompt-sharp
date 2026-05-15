import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-media-selection-bar',
  templateUrl: './media-selection-bar.html',
  styleUrl: './media-selection-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaSelectionBar {
  readonly bulkActioned = output<string>();
}
