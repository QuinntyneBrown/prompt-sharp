import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProjectsPageComponent } from 'components';
import { ProjectService } from 'api';

@Component({
  selector: 'lib-projects-page-container',
  standalone: true,
  imports: [ProjectsPageComponent],
  templateUrl: './projects-page-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageContainerComponent {
  private readonly service = inject(ProjectService);
  protected readonly projects = this.service.projects;
}
