import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HomePageComponent } from 'components';
import { ProjectService } from 'api';

@Component({
  selector: 'lib-home-page-container',
  standalone: true,
  imports: [HomePageComponent],
  templateUrl: './home-page-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageContainerComponent {
  private readonly projects = inject(ProjectService);
  private readonly router = inject(Router);

  protected readonly suggestions = this.projects.suggestions;

  protected onSubmitted(_text: string): void {
    this.router.navigate(['/projects', '0142']);
  }
}
