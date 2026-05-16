import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Phase, Prompt } from 'api';
import { PromptCardComponent } from '../prompt-card/prompt-card.component';

@Component({
  selector: 'lib-phase-block',
  standalone: true,
  imports: [PromptCardComponent],
  templateUrl: './phase-block.component.html',
  styleUrl: './phase-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhaseBlockComponent {
  readonly phase = input.required<Phase>();
  readonly promptCopied = output<Prompt>();
}
