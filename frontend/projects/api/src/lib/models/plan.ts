export interface Plan {
  readonly name: string;
  readonly tier: string;
  readonly projectsUsed: number;
  readonly projectQuota: number;
  readonly resetsLabel: string;
}
