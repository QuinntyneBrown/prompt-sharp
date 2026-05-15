import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-profile-hero',
  templateUrl: './profile-hero.html',
  styleUrl: './profile-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHero {
}
