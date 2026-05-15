import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-catalog-toolbar',
  templateUrl: './catalog-toolbar.html',
  styleUrl: './catalog-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogToolbar {
  readonly sortChanged = output<string>();
  readonly viewChanged = output<string>();
}
