import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-access-denied-page',
  templateUrl: './access-denied-page.html',
  styleUrl: './access-denied-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedPage {
}
