import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrandComponent } from '../brand/brand.component';

@Component({
  selector: 'lib-nav-bar',
  standalone: true,
  imports: [BrandComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent {}
