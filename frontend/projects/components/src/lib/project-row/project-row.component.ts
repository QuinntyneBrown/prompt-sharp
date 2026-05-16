import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectSummary } from 'api';

@Component({
  selector: 'lib-project-row',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-row.component.html',
  styleUrl: './project-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectRowComponent {
  readonly project = input.required<ProjectSummary>();

  protected readonly isDone = computed(() => this.project().status === 'shipped');
}
