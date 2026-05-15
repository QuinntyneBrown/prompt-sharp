import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ps-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  readonly page = input<number>(0);
  readonly pageCount = input<number>(0);
  readonly pageChanged = output<number>();
}
