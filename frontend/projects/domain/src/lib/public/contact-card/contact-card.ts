import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-contact-card',
  templateUrl: './contact-card.html',
  styleUrl: './contact-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactCard {
}
