import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectFilter, ProjectSummary } from 'api';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterThinComponent } from '../footer-thin/footer-thin.component';
import { ProjectRowComponent } from '../project-row/project-row.component';

const FILTERS: ReadonlyArray<ProjectFilter> = ['all', 'in progress', 'shipped', 'archived'];

@Component({
  selector: 'lib-projects-page',
  standalone: true,
  imports: [FormsModule, RouterLink, NavBarComponent, FooterThinComponent, ProjectRowComponent],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent {
  readonly projects = input.required<ReadonlyArray<ProjectSummary>>();

  protected readonly filters = FILTERS;
  protected readonly activeFilter = signal<ProjectFilter>('all');
  protected readonly query = signal('');

  protected readonly totalCount = computed(() => this.projects().length);
  protected readonly inProgressCount = computed(
    () => this.projects().filter(p => p.status === 'in progress').length
  );

  protected readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    const filter = this.activeFilter();
    return this.projects().filter(p => {
      const matchesFilter = filter === 'all' || p.status === filter;
      const matchesQuery = q.length === 0 || p.idea.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  });

  protected setFilter(value: ProjectFilter): void {
    this.activeFilter.set(value);
  }

  protected toLabel(value: ProjectFilter): string {
    return value === 'all' ? 'All' : this.titleCase(value);
  }

  private titleCase(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
