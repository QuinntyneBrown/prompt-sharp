import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Suggestion } from 'api';
import { NavStaticComponent } from '../nav-static/nav-static.component';
import { FooterThinComponent } from '../footer-thin/footer-thin.component';

@Component({
  selector: 'lib-home-page',
  standalone: true,
  imports: [FormsModule, RouterLink, NavStaticComponent, FooterThinComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  readonly suggestions = input.required<ReadonlyArray<Suggestion>>();
  readonly submitted = output<string>();

  protected readonly value = signal('');

  protected onSubmit(): void {
    const text = this.value().trim();
    if (text.length === 0) return;
    this.submitted.emit(text);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      this.onSubmit();
    }
  }

  protected onPick(prompt: string): void {
    this.value.set(prompt);
  }
}
