import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Prompt } from 'api';

@Component({
  selector: 'lib-prompt-card',
  standalone: true,
  templateUrl: './prompt-card.component.html',
  styleUrl: './prompt-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromptCardComponent {
  readonly prompt = input.required<Prompt>();
  readonly copyClicked = output<Prompt>();

  protected onCopy(): void {
    this.copyClicked.emit(this.prompt());
  }
}
