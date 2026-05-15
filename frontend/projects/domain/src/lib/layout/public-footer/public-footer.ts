import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-public-footer',
  templateUrl: './public-footer.html',
  styleUrl: './public-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicFooter {}
