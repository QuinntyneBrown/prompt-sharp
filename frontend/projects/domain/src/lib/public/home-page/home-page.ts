import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { PromptSharpTutorialsApi, TutorialListItem } from 'api';
import { HomeHero } from '../home-hero/home-hero';
import { FeaturedTutorials } from '../../tutorial/featured-tutorials/featured-tutorials';
import { LatestTutorials } from '../../tutorial/latest-tutorials/latest-tutorials';
import { TutorialTracks } from '../tutorial-tracks/tutorial-tracks';
import { MarqueeStrip } from '../marquee-strip/marquee-strip';

@Component({
  selector: 'ps-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HomeHero, FeaturedTutorials, LatestTutorials, TutorialTracks, MarqueeStrip],
})
export class HomePage implements OnInit {
  private readonly tutorialsApi = inject(PromptSharpTutorialsApi);

  protected readonly featured = signal<readonly TutorialListItem[]>([]);
  protected readonly latest = signal<readonly TutorialListItem[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.tutorialsApi.featured().subscribe({
      next: (items) => this.featured.set(items),
      error: (e: Error) => this.error.set(e.message),
    });
    this.tutorialsApi.list({ page: 1, pageSize: 12 }).subscribe({
      next: (page) => {
        this.latest.set(page.items);
        this.loading.set(false);
      },
      error: (e: Error) => {
        this.error.set(e.message);
        this.loading.set(false);
      },
    });
  }
}
