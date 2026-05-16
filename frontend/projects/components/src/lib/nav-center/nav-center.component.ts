import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrandComponent } from '../brand/brand.component';

@Component({
  selector: 'lib-nav-center',
  standalone: true,
  imports: [BrandComponent],
  templateUrl: './nav-center.component.html',
  styleUrl: './nav-center.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavCenterComponent {}
