import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicNav } from '../public-nav/public-nav';
import { PublicFooter } from '../public-footer/public-footer';

@Component({
  selector: 'ps-public-shell',
  templateUrl: './public-shell.html',
  styleUrl: './public-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, PublicNav, PublicFooter],
})
export class PublicShell {}
