import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Mono, Wordmark } from 'components';

@Component({
  selector: 'ps-public-footer',
  templateUrl: './public-footer.html',
  styleUrl: './public-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Mono, Wordmark],
})
export class PublicFooter {}
