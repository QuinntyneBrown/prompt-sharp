import { Phase } from './phase';
import { ProjectStatus } from './project-status';

export interface Project {
  readonly id: string;
  readonly idea: string;
  readonly createdLabel: string;
  readonly promptCount: number;
  readonly phaseCount: number;
  readonly estimate: string;
  readonly status: ProjectStatus;
  readonly phases: ReadonlyArray<Phase>;
}
