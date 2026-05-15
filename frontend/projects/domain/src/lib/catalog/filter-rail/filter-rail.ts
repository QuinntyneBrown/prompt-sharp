import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Chip, Rule } from 'components';

export interface FilterRailOption {
  readonly slug: string;
  readonly label: string;
}

@Component({
  selector: 'ps-filter-rail',
  templateUrl: './filter-rail.html',
  styleUrl: './filter-rail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chip, Rule],
})
export class FilterRail {
  readonly categories = input<readonly FilterRailOption[]>([]);
  readonly tags = input<readonly FilterRailOption[]>([]);
  readonly filtersChanged = output<Record<string, unknown>>();

  private readonly selectedCategories = signal<readonly string[]>([]);
  private readonly selectedTags = signal<readonly string[]>([]);

  protected isCategorySelected(slug: string): boolean {
    return this.selectedCategories().includes(slug);
  }
  protected isTagSelected(slug: string): boolean {
    return this.selectedTags().includes(slug);
  }

  protected toggleCategory(slug: string): void {
    this.selectedCategories.update((s) =>
      s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug],
    );
    this.emit();
  }
  protected toggleTag(slug: string): void {
    this.selectedTags.update((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));
    this.emit();
  }

  private emit(): void {
    this.filtersChanged.emit({
      categories: this.selectedCategories(),
      tags: this.selectedTags(),
    });
  }
}
