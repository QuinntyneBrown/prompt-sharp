import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Media, PromptSharpAdminMediaApi } from 'api';

@Component({
  selector: 'ps-admin-media-page',
  templateUrl: './admin-media-page.html',
  styleUrl: './admin-media-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMediaPage implements OnInit {
  private readonly mediaApi = inject(PromptSharpAdminMediaApi);

  protected readonly media = signal<readonly Media[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.mediaApi.list().subscribe({
      next: (m) => {
        this.media.set(m);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
