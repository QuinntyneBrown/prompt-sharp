import { Injectable, signal } from '@angular/core';
import { Project } from '../models/project';
import { ProjectSummary } from '../models/project-summary';
import { Suggestion } from '../models/suggestion';
import { PROJECT_FIXTURE } from '../data/project-fixture';
import { PROJECTS_FIXTURE } from '../data/projects-fixture';
import { SUGGESTIONS } from '../data/suggestions';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly _projects = signal<ReadonlyArray<ProjectSummary>>(PROJECTS_FIXTURE);
  private readonly _suggestions = signal<ReadonlyArray<Suggestion>>(SUGGESTIONS);

  readonly projects = this._projects.asReadonly();
  readonly suggestions = this._suggestions.asReadonly();

  getById(_id: string): Project {
    return PROJECT_FIXTURE;
  }

  buildPlanText(project: Project): string {
    const lines: string[] = [];
    lines.push(`# ${project.idea}`);
    lines.push('');
    lines.push(`Project № ${project.id} · ${project.promptCount} prompts · ${project.phaseCount} phases · est. ${project.estimate}`);
    lines.push('');

    for (const phase of project.phases) {
      lines.push(`## Phase ${phase.ix} — ${phase.title}`);
      lines.push('');
      for (const prompt of phase.prompts) {
        lines.push(`### ${prompt.n}. ${prompt.title}`);
        if (prompt.tags.length) {
          lines.push(`Tags: ${prompt.tags.join(', ')}`);
        }
        lines.push('');
        lines.push(prompt.body);
        lines.push('');
      }
    }

    return lines.join('\n');
  }
}
