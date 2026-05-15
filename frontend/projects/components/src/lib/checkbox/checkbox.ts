import { ChangeDetectionStrategy, Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

@Component({
  selector: 'lib-checkbox',
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-disabled]': 'disabled() || null',
  },
})
export class Checkbox {
  readonly checked = input<boolean>(false);
  readonly indeterminate = input<boolean>(false);
  readonly label = input<string | null>(null);
  readonly name = input<string | null>(null);
  readonly value = input<string | null>(null);
  readonly disabled = input<boolean>(false);

  readonly checkedChange = output<boolean>();

  protected readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('input');

  constructor() {
    effect(() => {
      const el = this.inputEl()?.nativeElement;
      if (el) el.indeterminate = this.indeterminate();
    });
  }

  protected onChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.checkedChange.emit(target.checked);
  }
}
