import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-glyph',
  templateUrl: './glyph.html',
  styleUrl: './glyph.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Glyph {}
