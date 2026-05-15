import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ps-profile-section',
  templateUrl: './profile-section.html',
  styleUrl: './profile-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSection {
  readonly heading = input.required<string>();
}
