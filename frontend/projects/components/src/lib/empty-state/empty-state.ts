import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-empty-state',
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  readonly icon = input<string | null>(null);
  readonly display = input<string | null>(null);
  readonly description = input<string | null>(null);
}
