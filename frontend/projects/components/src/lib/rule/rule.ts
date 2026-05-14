import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type RuleVariant = 'default' | 'soft';

@Component({
  selector: 'lib-rule',
  templateUrl: './rule.html',
  styleUrl: './rule.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'separator',
    '[attr.data-variant]': 'variant()',
  },
})
export class Rule {
  readonly variant = input<RuleVariant>('default');
}
