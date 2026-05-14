export type Guid = string;

export type IsoDateTimeString = string;

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type RoleName = 'Admin' | 'Editor' | 'User';

export type TutorialSort = 'created' | 'updated' | 'title' | 'difficulty' | 'minutes';

export interface PagedResult<TItem> {
  items: TItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface TutorialListItem {
  id: Guid;
  slug: string;
  title: string;
  summary: string;
  difficultyLevel: DifficultyLevel;
  estimatedMinutes: number;
  isPublished: boolean;
  isFeatured: boolean;
  isEditorsPick: boolean;
  categorySlug: string;
  categoryName: string;
  tags: string[];
  stepCount: number;
}

export interface TutorialDetail {
  id: Guid;
  slug: string;
  title: string;
  summary: string;
  difficultyLevel: DifficultyLevel;
  estimatedMinutes: number;
  isPublished: boolean;
  isFeatured: boolean;
  isEditorsPick: boolean;
  categoryId: Guid;
  categorySlug: string;
  categoryName: string;
  authorId: Guid;
  authorName: string;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
  steps: TutorialStep[];
  tags: Tag[];
}

export interface TutorialStep {
  id: Guid;
  order: number;
  title: string;
  bodyMarkdown: string;
  codeSnippet: string | null;
  codeLanguage: string | null;
  imageMediaId: Guid | null;
}

export interface Category {
  id: Guid;
  slug: string;
  name: string;
  order: number;
  tutorialCount: number;
}

export interface Tag {
  id: Guid;
  slug: string;
  name: string;
}

export interface User {
  id: Guid;
  sub: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: IsoDateTimeString;
  lastSeenAt: IsoDateTimeString;
  roles: RoleName[];
}

export interface Bookmark {
  tutorial: TutorialListItem;
  createdAt: IsoDateTimeString;
}

export interface TutorialProgress {
  userId: Guid;
  tutorialId: Guid;
  currentStepId: Guid | null;
  completedStepIds: Guid[];
  updatedAt: IsoDateTimeString;
}

export interface Media {
  id: Guid;
  url: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  uploadedById: Guid;
  uploadedAt: IsoDateTimeString;
}

export interface TutorialUpsert {
  slug: string;
  title: string;
  summary: string;
  difficultyLevel: DifficultyLevel;
  estimatedMinutes: number;
  categoryId: Guid;
  tagIds: Guid[];
}

export interface TutorialStepUpsert {
  title: string;
  bodyMarkdown: string;
  codeSnippet?: string | null;
  codeLanguage?: string | null;
  imageMediaId?: Guid | null;
}

export interface CategoryUpsert {
  slug: string;
  name: string;
  order: number;
}

export interface TagUpsert {
  slug: string;
  name: string;
}

export interface ProgressUpsert {
  currentStepId?: Guid | null;
  completedStepIds: Guid[];
}

export interface UserRolesUpsert {
  roles: RoleName[];
}

export interface PagedQuery {
  page?: number;
  pageSize?: number;
}

export interface TutorialListQuery extends PagedQuery {
  category?: string | null;
  tag?: string | null;
  difficulty?: DifficultyLevel | null;
  sort?: TutorialSort | null;
}

export interface AdminTutorialListQuery extends PagedQuery {
  search?: string | null;
}

export interface ApiProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [extension: string]: unknown;
}

export interface ApiValidationProblemDetails extends ApiProblemDetails {
  errors?: Record<string, string[]>;
}
