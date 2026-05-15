import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-tutorial-body',
  templateUrl: './tutorial-body.html',
  styleUrl: './tutorial-body.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialBody {
}
