import { Guid } from './guid';
import { IsoDateTimeString } from './iso-date-time-string';

export interface AdminDashboard {
  generatedAt: IsoDateTimeString;
  totalTutorials: number;
  publishedTutorials: number;
  draftTutorials: number;
  authorCount: number;
  mediaAssetCount: number;
  pendingInvitationCount: number;
  recentActivity: AdminDashboardActivity[];
  recentTutorials: AdminDashboardRecentTutorial[];
}

export interface AdminDashboardActivity {
  actor: string;
  action: string;
  targetName: string;
  changedAt: IsoDateTimeString;
}

export interface AdminDashboardRecentTutorial {
  id: Guid;
  title: string;
  categoryName: string;
  authorName: string;
  isPublished: boolean;
  updatedAt: IsoDateTimeString;
}
