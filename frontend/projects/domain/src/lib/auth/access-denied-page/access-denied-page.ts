import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ps-access-denied-page',
  templateUrl: './access-denied-page.html',
  styleUrl: './access-denied-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedPage implements OnInit {
  private readonly route = inject(ActivatedRoute);

  protected readonly status = signal<string | null>(null);
  protected readonly requiredRole = signal<string>('sysadmin');

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.requiredRole.set(params.get('required') ?? 'sysadmin');
    });
  }

  protected requestAccess(): void {
    this.status.set('Request sent. An administrator has been notified.');
  }
}
