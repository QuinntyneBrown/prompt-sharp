import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectPageComponent } from 'components';
import { AuthService, ProjectService, Prompt } from 'api';
import { downloadText } from '../download';

@Component({
  selector: 'lib-project-page-container',
  standalone: true,
  imports: [ProjectPageComponent],
  templateUrl: './project-page-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPageContainerComponent {
  readonly id = input.required<string>();

  private readonly projects = inject(ProjectService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly project = computed(() => this.projects.getById(this.id()));

  protected onDownload(): void {
    const project = this.project();
    const filename = `promptsharp-${project.id}.txt`;
    const body = this.projects.buildPlanText(project);
    downloadText(filename, body);
  }

  protected onCopy(prompt: Prompt): void {
    void navigator.clipboard?.writeText(prompt.body);
  }

  protected onSignOut(): void {
    this.auth.signOut();
    this.router.navigate(['/signin']);
  }
}
