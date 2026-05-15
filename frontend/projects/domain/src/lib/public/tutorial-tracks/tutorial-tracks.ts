import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-tutorial-tracks',
  templateUrl: './tutorial-tracks.html',
  styleUrl: './tutorial-tracks.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialTracks {
}
