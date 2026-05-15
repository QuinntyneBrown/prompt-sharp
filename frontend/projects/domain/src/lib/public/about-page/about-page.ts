import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactCard } from '../contact-card/contact-card';

@Component({
  selector: 'ps-about-page',
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContactCard],
})
export class AboutPage {
}
