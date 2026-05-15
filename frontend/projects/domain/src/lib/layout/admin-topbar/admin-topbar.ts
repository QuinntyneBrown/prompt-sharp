import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'ps-admin-topbar',
  templateUrl: './admin-topbar.html',
  styleUrl: './admin-topbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTopbar {
  readonly currentUserName = input<string | null>('Quinntyne Brown');
  readonly signOut = output<void>();

  protected readonly initials = computed(() => {
    const name = this.currentUserName()?.trim() || 'Quinntyne Brown';
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'QB';
  });
}
