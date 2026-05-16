import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BrandComponent } from '../brand/brand.component';

@Component({
  selector: 'lib-nav-static',
  standalone: true,
  imports: [BrandComponent],
  templateUrl: './nav-static.component.html',
  styleUrl: './nav-static.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavStaticComponent {}
