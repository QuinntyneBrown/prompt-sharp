import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Chip } from 'components';

@Component({
  selector: 'ps-admin-filter-chips',
  templateUrl: './admin-filter-chips.html',
  styleUrl: './admin-filter-chips.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Chip],
})
export class AdminFilterChips {
  readonly options = input<readonly string[]>([]);
  readonly filtersChanged = output<string[]>();
  private readonly selection = signal<readonly string[]>([]);

  protected isSelected(option: string): boolean {
    return this.selection().includes(option);
  }
  protected toggle(option: string): void {
    this.selection.update((s) =>
      s.includes(option) ? s.filter((x) => x !== option) : [...s, option],
    );
    this.filtersChanged.emit([...this.selection()]);
  }
}
