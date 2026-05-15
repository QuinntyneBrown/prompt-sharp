import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GlyphSize } from './glyph-size';
import { GlyphTone } from './glyph-tone';

@Component({
  selector: 'lib-glyph',
  templateUrl: './glyph.html',
  styleUrl: './glyph.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-framed]': 'framed() || null',
    '[attr.role]': 'decorative() ? null : "img"',
    '[attr.aria-hidden]': 'decorative() ? "true" : null',
    '[attr.aria-label]': 'decorative() ? null : label()',
  },
})
export class Glyph {
  readonly name = input<string | null>(null);
  readonly size = input<GlyphSize>('md');
  readonly tone = input<GlyphTone>('default');
  readonly framed = input<boolean>(false);
  readonly decorative = input<boolean>(true);
  readonly label = input<string | null>(null);
}
