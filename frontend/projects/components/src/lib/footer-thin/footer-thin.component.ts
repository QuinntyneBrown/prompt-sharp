import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-footer-thin',
  standalone: true,
  templateUrl: './footer-thin.component.html',
  styleUrl: './footer-thin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterThinComponent {}
