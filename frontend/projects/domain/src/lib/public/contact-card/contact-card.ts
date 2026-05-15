import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PromptSharpContactApi } from 'api';

@Component({
  selector: 'ps-contact-card',
  templateUrl: './contact-card.html',
  styleUrl: './contact-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactCard {
  private readonly contactApi = inject(PromptSharpContactApi);

  protected readonly name = signal<string>('');
  protected readonly email = signal<string>('');
  protected readonly message = signal<string>('');
  protected readonly status = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly submitting = signal<boolean>(false);

  protected submit(): void {
    this.submitting.set(true);
    this.status.set(null);
    this.error.set(null);

    this.contactApi.submit({
      name: this.name(),
      email: this.email(),
      message: this.message(),
    }).subscribe({
      next: () => {
        this.status.set('Message sent. We will follow up soon.');
        this.submitting.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.submitting.set(false);
      },
    });
  }
}
