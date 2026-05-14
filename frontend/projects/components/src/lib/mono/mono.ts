import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-mono',
  templateUrl: './mono.html',
  styleUrl: './mono.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Mono {}
