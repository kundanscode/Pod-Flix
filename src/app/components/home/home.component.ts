import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PodcastService, Podcast } from '../../services/podcast.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <!-- Hero Section -->
    @if (featuredPodcast(); as podcast) {
    <div class="hero">
      <div class="hero-bg">
        <img [src]="podcast.thumbnailUrl" alt="Hero Background">
        <div class="hero-vignette"></div>
      </div>
      <div class="hero-content">
        <h1>{{ podcast.title }}</h1>
        <p>{{ podcast.description }}</p>
        <div class="hero-buttons">
            <button class="btn-play">▶ Play</button>
            <button class="btn-info">ℹ More Info</button>
        </div>
      </div>
    </div>
    }

    <!-- Rows -->
    <div class="row-container">
        <h2>Trending Now</h2>
        <div class="row">
            @for (podcast of trendingPodcasts(); track podcast.id) {
            <div class="podcast-card" 
                 (mouseenter)="onMouseEnter(podcast)"
                 (mouseleave)="onMouseLeave()">
                 
                 <!-- Default Thumbnail -->
                 @if (hoveredPodcastId() !== podcast.id) {
                 <img [src]="podcast.thumbnailUrl" class="card-img">
                 }

                 <!-- Video Preview on Hover -->
                 @if (hoveredPodcastId() === podcast.id) {
                 <div class="video-preview">
                     <video [src]="podcast.videoUrl" 
                            [muted]="isMuted()" 
                            autoplay 
                            loop
                            class="card-video">
                     </video>
                     <div class="video-controls">
                        <button (click)="toggleMute($event)">{{ isMuted() ? '🔇' : '🔊' }}</button>
                     </div>
                 </div>
                 }
            </div>
            }
        </div>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredPodcast = signal<Podcast | undefined>(undefined);
  trendingPodcasts = signal<Podcast[]>([]);
  
  hoveredPodcastId = signal<string | null>(null);
  isMuted = signal(true);
  hoverTimeout: any;

  constructor(private podcastService: PodcastService) {}

  ngOnInit() {
    this.podcastService.getFeatured().subscribe(data => this.featuredPodcast.set(data));
    this.podcastService.getTrending().subscribe(data => this.trendingPodcasts.set(data));
  }

  onMouseEnter(podcast: Podcast) {
      // Delay playing video slightly to avoid rapid flicker
      this.hoverTimeout = setTimeout(() => {
          this.hoveredPodcastId.set(podcast.id);
      }, 500); 
  }

  onMouseLeave() {
      clearTimeout(this.hoverTimeout);
      this.hoveredPodcastId.set(null);
      this.isMuted.set(true); // Reset mute on leave
  }

  toggleMute(event: Event) {
      event.stopPropagation();
      this.isMuted.update(val => !val);
  }
}
