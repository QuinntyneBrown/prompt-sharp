import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StatusDotTone } from './status-dot-tone';

@Component({
  selector: 'lib-status-dot',
  templateUrl: './status-dot.html',
  styleUrl: './status-dot.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-tone]': 'tone()',
    '[attr.data-pulse]': 'pulse() || null',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label()',
    '[attr.aria-hidden]': 'label() ? null : "true"',
  },
})
export class StatusDot {
  readonly tone = input<StatusDotTone>('default');
  readonly pulse = input<boolean>(false);
  readonly label = input<string | null>(null);
}
