import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-catalog-grid',
  templateUrl: './catalog-grid.html',
  styleUrl: './catalog-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogGrid {
}
