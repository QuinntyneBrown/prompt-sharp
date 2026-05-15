import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Category, PromptSharpCategoriesApi, PromptSharpTutorialsApi, TutorialListItem } from 'api';
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
  private readonly categoriesApi = inject(PromptSharpCategoriesApi);

  protected readonly featured = signal<readonly TutorialListItem[]>([]);
  protected readonly editorsPick = signal<TutorialListItem | null>(null);
  protected readonly categories = signal<readonly Category[]>([]);
  protected readonly latest = signal<readonly TutorialListItem[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    let pending = 4;
    const done = () => {
      pending -= 1;
      if (pending === 0) {
        this.loading.set(false);
      }
    };

    this.tutorialsApi.featured().subscribe({
      next: (items) => {
        this.featured.set(items);
        done();
      },
      error: (e: Error) => {
        this.error.set(e.message);
        done();
      },
    });
    this.tutorialsApi.editorsPick().subscribe({
      next: (item) => {
        this.editorsPick.set(item);
        done();
      },
      error: (e: Error) => {
        this.error.set(e.message);
        done();
      },
    });
    this.categoriesApi.list().subscribe({
      next: (items) => {
        this.categories.set(items);
        done();
      },
      error: (e: Error) => {
        this.error.set(e.message);
        done();
      },
    });
    this.tutorialsApi.list({ page: 1, pageSize: 12 }).subscribe({
      next: (page) => {
        this.latest.set(page.items);
        done();
      },
      error: (e: Error) => {
        this.error.set(e.message);
        done();
      },
    });
  }
}
