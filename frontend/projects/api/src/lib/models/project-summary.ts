import { ProjectStatus } from './project-status';

export interface ProjectSummary {
  readonly id: string;
  readonly idea: string;
  readonly promptCount: number;
  readonly whenLabel: string;
  readonly status: ProjectStatus;
}
