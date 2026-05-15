import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { SearchField } from 'components';

@Component({
  selector: 'ps-search-bar',
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchField],
})
export class SearchBar {
  readonly queryChanged = output<string>();
}
