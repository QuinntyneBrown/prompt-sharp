import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavCenterComponent } from '../nav-center/nav-center.component';
import { FooterThinComponent } from '../footer-thin/footer-thin.component';

@Component({
  selector: 'lib-error-page',
  standalone: true,
  imports: [RouterLink, NavCenterComponent, FooterThinComponent],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorPageComponent {
  protected readonly traceId = this.makeTrace();
  protected readonly timestamp = this.makeTimestamp();

  private makeTrace(): string {
    return 'req-' + Math.random().toString(36).slice(2, 8);
  }

  private makeTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  }
}
