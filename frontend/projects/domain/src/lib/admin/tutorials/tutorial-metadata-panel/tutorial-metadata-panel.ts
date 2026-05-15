import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-tutorial-metadata-panel',
  templateUrl: './tutorial-metadata-panel.html',
  styleUrl: './tutorial-metadata-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialMetadataPanel {
}
