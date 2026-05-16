import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ErrorPageComponent } from 'components';

@Component({
  selector: 'lib-error-page-container',
  standalone: true,
  imports: [ErrorPageComponent],
  templateUrl: './error-page-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorPageContainerComponent {}
