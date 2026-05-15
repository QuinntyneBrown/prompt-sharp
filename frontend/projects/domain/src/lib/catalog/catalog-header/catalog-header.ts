import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-catalog-header',
  templateUrl: './catalog-header.html',
  styleUrl: './catalog-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogHeader {
}
