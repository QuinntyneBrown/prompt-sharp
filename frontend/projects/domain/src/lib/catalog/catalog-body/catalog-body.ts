import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-catalog-body',
  templateUrl: './catalog-body.html',
  styleUrl: './catalog-body.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogBody {
}
