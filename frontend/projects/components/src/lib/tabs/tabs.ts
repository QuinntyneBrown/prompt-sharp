import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TabsTab } from './tabs-tab';

@Component({
  selector: 'lib-tabs',
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'tablist',
  },
})
export class Tabs {
  readonly tabs = input.required<TabsTab[]>();
  readonly selected = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);

  readonly selectedChange = output<string>();

  protected onSelect(tab: TabsTab): void {
    if (tab.disabled) return;
    this.selectedChange.emit(tab.value);
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    const total = this.tabs().length;
    let target = -1;
    if (event.key === 'ArrowRight') target = (index + 1) % total;
    if (event.key === 'ArrowLeft') target = (index - 1 + total) % total;
    if (target < 0) return;
    event.preventDefault();
    const tab = this.tabs()[target];
    if (tab && !tab.disabled) this.selectedChange.emit(tab.value);
  }
}
