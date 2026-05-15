import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'lib-drop-zone',
  templateUrl: './drop-zone.html',
  styleUrl: './drop-zone.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-disabled]': 'disabled() || null',
    '[attr.data-drag-active]': 'dragActive() || null',
  },
})
export class DropZone {
  readonly accept = input<string | null>(null);
  readonly multiple = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly label = input<string>('Drop files here');
  readonly description = input<string | null>(null);

  readonly filesSelected = output<FileList>();
  readonly dragActiveChange = output<boolean>();

  protected readonly dragActive = signal(false);

  protected onInput(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files?.length) this.filesSelected.emit(files);
  }

  protected onDragOver(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.setDragActive(true);
  }

  protected onDragLeave(): void {
    this.setDragActive(false);
  }

  protected onDrop(event: DragEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    this.setDragActive(false);
    const files = event.dataTransfer?.files;
    if (files?.length) this.filesSelected.emit(files);
  }

  private setDragActive(value: boolean): void {
    if (this.dragActive() === value) return;
    this.dragActive.set(value);
    this.dragActiveChange.emit(value);
  }
}
