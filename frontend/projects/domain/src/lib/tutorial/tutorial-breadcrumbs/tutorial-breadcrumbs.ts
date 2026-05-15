import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ps-tutorial-breadcrumbs',
  templateUrl: './tutorial-breadcrumbs.html',
  styleUrl: './tutorial-breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TutorialBreadcrumbs {
  readonly crumbs = input<{ label: string; href: string | null }[]>([]);
}
