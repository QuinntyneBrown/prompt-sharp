import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-about-body',
  templateUrl: './about-body.html',
  styleUrl: './about-body.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutBody {
}
