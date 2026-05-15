import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PaginationButton } from 'components';

@Component({
  selector: 'ps-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PaginationButton],
})
export class Pagination {
  readonly page = input<number>(1);
  readonly pageCount = input<number>(1);
  readonly pageChanged = output<number>();

  protected readonly pages = computed(() => {
    const count = this.pageCount();
    return Array.from({ length: Math.max(count, 1) }, (_, i) => i + 1);
  });

  protected select(p: number): void {
    this.pageChanged.emit(p);
  }
}
