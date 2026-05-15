import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-tutorial-editor-layout',
  templateUrl: './tutorial-editor-layout.html',
  styleUrl: './tutorial-editor-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialEditorLayout {
}
