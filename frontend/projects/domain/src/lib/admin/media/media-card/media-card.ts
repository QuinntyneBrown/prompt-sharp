import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ps-media-card',
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaCard {
  readonly filename = input.required<string>();
  readonly thumbnailUrl = input<string | null>(null);
  readonly selectedChanged = output<boolean>();
}
