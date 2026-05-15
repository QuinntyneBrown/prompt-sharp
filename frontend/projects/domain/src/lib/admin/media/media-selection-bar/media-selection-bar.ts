import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Media } from 'api';

@Component({
  selector: 'ps-media-selection-bar',
  templateUrl: './media-selection-bar.html',
  styleUrl: './media-selection-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    role: 'region',
    'aria-label': 'Media selection',
  },
})
export class MediaSelectionBar {
  readonly selection = input<readonly Media[]>([]);
  readonly download = output<readonly Media[]>();
  readonly move = output<readonly Media[]>();
  readonly deleteRequested = output<readonly Media[]>({ alias: 'delete' });

  protected readonly selectionLabel = computed(() => {
    const count = this.selection().length;
    return `${count} ${count === 1 ? 'item' : 'items'} selected`;
  });

  protected downloadSelection(): void {
    this.download.emit(this.selection());
  }

  protected moveSelection(): void {
    this.move.emit(this.selection());
  }

  protected deleteSelection(): void {
    this.deleteRequested.emit(this.selection());
  }
}
