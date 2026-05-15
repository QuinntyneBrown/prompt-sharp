import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-admin-taxonomy-table',
  templateUrl: './admin-taxonomy-table.html',
  styleUrl: './admin-taxonomy-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTaxonomyTable {
}
