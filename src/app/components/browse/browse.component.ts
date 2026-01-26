import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PodcastService, Podcast } from '../../services/podcast.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { VideoCardComponent } from '../video-card/video-card.component';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, NavbarComponent, VideoCardComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="browse-container">
      <!-- Hero Section -->
      @if (featuredPodcast(); as hero) {
        <div class="hero-section">
          <div class="hero-video-wrapper">
            @if (featuredVideoUrl()) {
              <iframe
                [src]="featuredVideoUrl()"
                frameborder="0"
                title="Hero Video"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              >
              </iframe>
            }
          </div>
          <div class="hero-vignette"></div>
          <div class="hero-content">
            <h1>{{ hero.title }}</h1>
            <!-- <p>{{ hero.description }}</p> -->
            <div class="hero-actions">
              <button class="play-btn" (click)="playHero()"><span class="icon">▶</span> Pl</button>
              <button class="info-btn"><span class="icon">ℹ</span> More Info</button>
            </div>
          </div>

          <button class="mute-btn" (click)="toggleHeroMute()">
            @if (isHeroMuted()) {
              <span class="icon">🔇</span>
            } @else {
              <span class="icon">🔊</span>
            }
          </button>
        </div>
      }

      <div class="category-header">
        <h1>{{ currentCategory() || 'Browse' }}</h1>
      </div>

      <div class="grid">
        @if (isLoading()) {
          @for (item of skeletonItems; track item) {
            <div class="skeleton-card"></div>
          }
        } @else {
          @for (podcast of podcasts(); track podcast.id) {
            <div class="card-wrapper">
              <app-video-card [podcast]="podcast"></app-video-card>
            </div>
          }
        }
      </div>

      <!-- Netflix Style Pagination -->
      @if (!isLoading() && totalPages() > 1) {
        <div class="pagination">
          <button class="nav-btn" (click)="prevPage()" [disabled]="currentPage() === 0">
            <span class="icon">‹</span> Previous
          </button>

          <!-- Optional: Page indicator like '1 of 5' or just buttons -->
          <div class="page-info">{{ currentPage() + 1 }} ... {{ totalPages() }}</div>

          <button
            class="nav-btn"
            (click)="nextPage()"
            [disabled]="currentPage() === totalPages() - 1"
          >
            Next <span class="icon">›</span>
          </button>
        </div>
      }
    </div>
  `,
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit, OnDestroy {
  // Signals for Reactive State
  podcasts = signal<Podcast[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  isLoading = signal(false);
  currentCategory = signal<string | undefined>(undefined);

  // Hero Section State
  featuredPodcast = signal<Podcast | undefined>(undefined);
  featuredVideoUrl = signal<SafeResourceUrl | undefined>(undefined);
  isHeroMuted = signal(true);
  rotationInterval: any;

  itemsPerPage = 25;
  skeletonItems = new Array(25).fill(0);

  constructor(
    private podcastService: PodcastService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.currentCategory.set(params['category']);
      this.currentPage.set(0);
      this.loadPodcasts();
    });
  }

  loadPodcasts() {
    this.isLoading.set(true);
    // Stop any existing rotation logic when reloading category
    this.stopRotation();

    const categoryToFetch = this.currentCategory() || 'Technology';

    this.podcastService
      .getPodcasts(this.currentPage(), this.itemsPerPage, categoryToFetch)
      .subscribe((data) => {
        this.podcasts.set(data.content);
        this.totalPages.set(data.totalPages);
        this.isLoading.set(false);
        window.scrollTo(0, 0);

        // Start Hero Rotation
        if (data.content.length > 0) {
          this.updateHero(data.content);
          this.startRotation(data.content);
        }
      });
  }

  startRotation(podcasts: Podcast[]) {
    this.rotationInterval = setInterval(() => {
      this.updateHero(podcasts);
    }, 15000); // 15 seconds
  }

  stopRotation() {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }

  updateHero(podcasts: Podcast[]) {
    if (!podcasts.length) return;
    const random = podcasts[Math.floor(Math.random() * podcasts.length)];
    this.featuredPodcast.set(random);
    this.isHeroMuted.set(true); // Reset mute state for new video

    // Update Video URL
    // autoplay=1, mute=1, controls=0, loop=1, enablejsapi=1 (for postMessage control)
    const videoId = random.id;
    const url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}&enablejsapi=1&start=10`;
    // added start=10 to skip intros for hero feel
    this.featuredVideoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

  playHero() {
    const hero = this.featuredPodcast();
    if (hero) {
      this.router.navigate(['/watch', hero.id]);
    }
  }

  toggleHeroMute() {
    this.isHeroMuted.update((m) => !m);
    const iframe = document.querySelector('.hero-video-wrapper iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      const command = this.isHeroMuted() ? 'mute' : 'unMute';
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: command,
          args: [],
        }),
        '*',
      );
    }
  }

  ngOnDestroy() {
    this.stopRotation();
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update((p) => p + 1);
      this.loadPodcasts();
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update((p) => p - 1);
      this.loadPodcasts();
    }
  }
}
