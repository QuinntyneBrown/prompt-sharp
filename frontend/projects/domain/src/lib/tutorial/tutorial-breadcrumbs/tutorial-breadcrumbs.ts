import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Breadcrumb } from 'components';

@Component({
  selector: 'ps-tutorial-breadcrumbs',
  templateUrl: './tutorial-breadcrumbs.html',
  styleUrl: './tutorial-breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumb],
})
export class TutorialBreadcrumbs {
  readonly crumbs = input<{ label: string; href: string | null }[] | null>(null);
}
