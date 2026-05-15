import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AvatarSize } from './avatar-size';
import { AvatarStatus } from './avatar-status';

@Component({
  selector: 'lib-avatar',
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-status]': 'status()',
    '[attr.aria-label]': 'name()',
    role: 'img',
  },
})
export class Avatar {
  readonly name = input.required<string>();
  readonly src = input<string | null>(null);
  readonly size = input<AvatarSize>('md');
  readonly status = input<AvatarStatus | null>(null);

  protected readonly initials = computed(() => {
    const parts = this.name().trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return '';
    const first = parts[0][0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
    return (first + last).toUpperCase();
  });
}
