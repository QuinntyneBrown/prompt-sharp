import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, Prompt } from 'api';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterThinComponent } from '../footer-thin/footer-thin.component';
import { PhaseBlockComponent } from '../phase-block/phase-block.component';

@Component({
  selector: 'lib-project-page',
  standalone: true,
  imports: [RouterLink, NavBarComponent, FooterThinComponent, PhaseBlockComponent],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPageComponent {
  readonly project = input.required<Project>();
  readonly downloadClicked = output<void>();
  readonly promptCopied = output<Prompt>();
  readonly signOutClicked = output<void>();
}
