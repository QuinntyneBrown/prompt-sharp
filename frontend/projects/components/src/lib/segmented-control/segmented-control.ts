import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SegmentedControlDensity } from './segmented-control-density';
import { SegmentedControlOption } from './segmented-control-option';

@Component({
  selector: 'lib-segmented-control',
  templateUrl: './segmented-control.html',
  styleUrl: './segmented-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-density]': 'density()',
    role: 'tablist',
  },
})
export class SegmentedControl {
  readonly options = input.required<SegmentedControlOption[]>();
  readonly selected = input<string | null>(null);
  readonly density = input<SegmentedControlDensity>('default');
  readonly ariaLabel = input<string | null>(null);

  readonly selectedChange = output<string>();

  protected onSelect(option: SegmentedControlOption): void {
    if (option.disabled) return;
    this.selectedChange.emit(option.value);
  }
}
