import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-breadcrumb',
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-current]': 'current() || null',
    '[attr.aria-current]': 'current() ? "page" : null',
  },
})
export class Breadcrumb {
  readonly label = input.required<string>();
  readonly href = input<string | null>(null);
  readonly current = input<boolean>(false);
}
