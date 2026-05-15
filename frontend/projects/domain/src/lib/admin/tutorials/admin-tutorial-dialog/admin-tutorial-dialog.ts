import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { DifficultyLevel } from 'api';
import { Button, DialogShell, SelectField, SelectFieldOption, TextArea, TextField } from 'components';

export interface AdminTutorialDialogSubmit {
  title: string;
  slug: string;
  summary: string;
  categoryId: string;
  difficultyLevel: DifficultyLevel;
  estimatedMinutes: number;
}

@Component({
  selector: 'ps-admin-tutorial-dialog',
  templateUrl: './admin-tutorial-dialog.html',
  styleUrl: './admin-tutorial-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, DialogShell, SelectField, TextArea, TextField],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminTutorialDialog {
  readonly open = input<boolean>(false);
  readonly categoryOptions = input<SelectFieldOption[]>([]);
  readonly error = input<string | null>(null);

  readonly submitted = output<AdminTutorialDialogSubmit>();
  readonly cancelled = output<void>();

  protected readonly title = signal<string>('Wiring MediatR into a Clean Architecture API');
  protected readonly slug = signal<string>('wiring-mediatr-into-clean-architecture-api');
  protected readonly summary = signal<string>(
    'Vertical-slice handlers, validators and pipeline behaviors without ceremony or surprises.',
  );
  protected readonly categoryId = signal<string>('');
  protected readonly difficultyLevel = signal<DifficultyLevel | ''>('intermediate');
  protected readonly estimatedMinutes = signal<string>('38');
  protected readonly validation = signal<string | null>(null);
  protected readonly difficultyOptions: SelectFieldOption[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  protected setDifficulty(value: string): void {
    if (value === 'beginner' || value === 'intermediate' || value === 'advanced') {
      this.difficultyLevel.set(value);
    }
  }

  protected submit(): void {
    const title = this.title().trim();
    const slug = this.slug().trim();
    const summary = this.summary().trim();
    const categoryId = this.categoryId();
    const difficultyLevel = this.difficultyLevel();
    const estimatedMinutes = Number.parseInt(this.estimatedMinutes(), 10);

    if (!title || !slug || !summary || !categoryId || !difficultyLevel || !Number.isFinite(estimatedMinutes)) {
      this.validation.set('Title, slug, summary, category, difficulty, and estimated minutes are required.');
      return;
    }

    if (estimatedMinutes <= 0) {
      this.validation.set('Estimated minutes must be greater than zero.');
      return;
    }

    this.validation.set(null);
    this.submitted.emit({
      title,
      slug,
      summary,
      categoryId,
      difficultyLevel,
      estimatedMinutes,
    });
  }
}
