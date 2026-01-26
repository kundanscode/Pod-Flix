import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PodcastService, Podcast } from '../../services/podcast.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { VideoCardComponent } from '../video-card/video-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, VideoCardComponent],
  template: `
    <app-navbar></app-navbar>

    <!-- Hero Section -->
    @if (featuredPodcast(); as hero) {
      <div class="hero">
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
          <div class="hero-buttons">
            <button class="btn-play" (click)="playHero()">▶ Play</button>
            <button class="btn-info">ℹ More Info</button>
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

    <!-- Grid Layout -->
    <div class="main-container">
      <h2>Trending Now</h2>
      <div class="grid">
        @for (podcast of trendingPodcasts(); track podcast.id) {
          <div class="card-wrapper">
            <app-video-card [podcast]="podcast"></app-video-card>
          </div>
        }
      </div>

      <!-- Pagination -->
      @if (!isLoading() && totalPages() > 1) {
        <div class="pagination">
          <button class="nav-btn" (click)="prevPage()" [disabled]="currentPage() === 0">
            <span class="icon">‹</span> Previous
          </button>

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
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Signals for Reactive State
  featuredPodcast = signal<Podcast | undefined>(undefined);
  trendingPodcasts = signal<Podcast[]>([]);

  // Pagination State
  currentPage = signal(0);
  totalPages = signal(0);
  isLoading = signal(false);
  itemsPerPage = 25;

  // Hero Section State
  featuredVideoUrl = signal<SafeResourceUrl | undefined>(undefined);
  isHeroMuted = signal(true);
  rotationInterval: any;

  constructor(
    private podcastService: PodcastService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.podcastService.getFeatured().subscribe((data) => {
      // Ideally featured is separate, but we can also initialize hero from trending if needed
      // For now keep existing behavior for featured fetch
      this.featuredPodcast.set(data);
      if (data) {
        this.updateHero([data]); // Initialize with single featured item
      }
    });

    this.loadTrending();
  }

  loadTrending() {
    this.isLoading.set(true);
    // If we want rotation based on trending items:
    this.stopRotation();

    this.podcastService.getTrending(this.currentPage(), this.itemsPerPage).subscribe((data) => {
      this.trendingPodcasts.set(data.content);
      this.totalPages.set(data.totalPages);
      this.isLoading.set(false);
      window.scrollTo(0, 0);

      // Optional: Rotate Hero with trending items if we want dynamic hero
      // similar to Browse. User asked for "same as other pages".
      // Browse rotates the list. Let's rotate trending items in Hero.
      if (data.content.length > 0) {
        this.updateHero(data.content);
        this.startRotation(data.content);
      }
    });
  }

  // --- Hero Logic (Ported from BrowseComponent) ---

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
    const videoId = random.id;
    const url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}&enablejsapi=1&start=10`;
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

  // --- Pagination Logic ---

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update((p) => p + 1);
      this.loadTrending();
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.currentPage.update((p) => p - 1);
      this.loadTrending();
    }
  }

  ngOnDestroy() {
    this.stopRotation();
  }
}
