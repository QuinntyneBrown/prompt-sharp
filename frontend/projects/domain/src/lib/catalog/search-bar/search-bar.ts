import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'ps-search-bar',
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar {
  readonly queryChanged = output<string>();
}
