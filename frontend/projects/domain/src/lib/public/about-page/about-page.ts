import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-about-page',
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPage {
}
