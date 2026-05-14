import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RuleVariant } from './rule-variant';

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
