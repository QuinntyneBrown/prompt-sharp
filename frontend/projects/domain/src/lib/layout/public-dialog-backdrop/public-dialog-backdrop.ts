import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ps-public-dialog-backdrop',
  templateUrl: './public-dialog-backdrop.html',
  styleUrl: './public-dialog-backdrop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicDialogBackdrop {
}
