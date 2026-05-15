import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RuleOrientation } from './rule-orientation';
import { RuleVariant } from './rule-variant';

@Component({
  selector: 'lib-rule',
  templateUrl: './rule.html',
  styleUrl: './rule.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'separator',
    '[attr.aria-orientation]': 'orientation()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-inset]': 'inset() || null',
  },
})
export class Rule {
  readonly variant = input<RuleVariant>('default');
  readonly orientation = input<RuleOrientation>('horizontal');
  readonly inset = input<boolean>(false);
}
