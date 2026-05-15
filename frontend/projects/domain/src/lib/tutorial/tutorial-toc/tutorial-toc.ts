import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-tutorial-toc',
  templateUrl: './tutorial-toc.html',
  styleUrl: './tutorial-toc.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialToc {
}
