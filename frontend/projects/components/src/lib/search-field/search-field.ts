import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-search-field',
  templateUrl: './search-field.html',
  styleUrl: './search-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-disabled]': 'disabled() || null',
  },
})
export class SearchField {
  readonly value = input<string>('');
  readonly placeholder = input<string>('Search');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>('Search');

  readonly valueChange = output<string>();
  readonly searched = output<string>();
  readonly cleared = output<void>();

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const target = event.target as HTMLInputElement;
      this.searched.emit(target.value);
    }
  }

  protected onClear(): void {
    if (this.disabled()) return;
    this.cleared.emit();
    this.valueChange.emit('');
  }
}
