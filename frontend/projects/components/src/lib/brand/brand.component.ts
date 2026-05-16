import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-brand',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandComponent {}
