import { Component, Input, OnInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Podcast } from '../../services/podcast.service';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="video-card-container"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (click)="playFullVideo($event)"
      [class.is-hovered]="showPopup"
    >
      <!-- Base Card (Thumbnail) -->
      <div class="base-card">
        <img [src]="podcast.thumbnailUrl" [alt]="podcast.title" loading="lazy" />
        @if (!showPopup) {
        <h3 class="title-overlay">{{ podcast.title }}</h3>
        }
      </div>

      <!-- Popup Card (Video Player) -->
      @if (showPopup) {
      <div class="popup-card" [style.transform-origin]="transformOrigin">
        <div class="video-wrapper">
          <!-- YouTube Embed -->
          @if (safeUrl) {
          <iframe
            [src]="safeUrl"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          >
          </iframe>
          }

          <div class="controls">
            <button (click)="toggleMute($event)" class="control-btn mute-btn">
              {{ isMuted ? '🔇' : '🔊' }}
            </button>
          </div>
        </div>

        <div class="info-mask">
          <div class="mini-controls">
            <button class="play-btn" (click)="playFullVideo($event)">▶</button>
            <button class="add-btn" (click)="$event.stopPropagation()">+</button>
            <button class="like-btn" (click)="$event.stopPropagation()">👍</button>
          </div>
          <h4>{{ podcast.title }}</h4>
          <div class="meta-tags">
            <span class="match-score">98% Match</span>
            <span class="rating">12+</span>
            <span class="duration">1h 20m</span>
          </div>
          <div class="genres">
            <span>{{ podcast.category }}</span>
            <span> • Podcast</span>
          </div>
        </div>
      </div>
      }
    </div>
  `,
  styleUrls: ['./video-card.component.css'],
})
export class VideoCardComponent implements OnDestroy {
  @Input() podcast!: Podcast;

  showPopup = false;
  isMuted = true;
  hoverTimeout: any;
  transformOrigin = 'center center';
  safeUrl: SafeResourceUrl | undefined;

  constructor(
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  onMouseEnter() {
    this.hoverTimeout = setTimeout(() => {
      this.calculateTransformOrigin();
      this.showPopup = true;
      this.updateVideoUrl();
      this.cdr.detectChanges();
    }, 600); // 600ms delay like Netflix
  }

  onMouseLeave() {
    clearTimeout(this.hoverTimeout);
    this.showPopup = false;
    this.safeUrl = undefined; // Stop video
  }

  toggleMute(event: Event) {
    event.stopPropagation();
    this.isMuted = !this.isMuted;
    this.updateVideoUrl(); // Re-load iframe with new mute state
  }

  updateVideoUrl() {
    // YouTube Embed params: autoplay=1, controls=0, mute=1 (if muted), distinct playlist for looping
    const muteParam = this.isMuted ? '1' : '0';
    const videoId = this.podcast.id;
    // loop=1 requires playlist=VIDEO_ID
    const url = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muteParam}&controls=0&modestbranding=1&loop=1&playlist=${videoId}`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  playFullVideo(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/watch', this.podcast.id]);
  }

  calculateTransformOrigin() {
    // Logic to determine if card is on the edge of the screen to adjust expansion direction
    const rect = this.el.nativeElement.getBoundingClientRect();
    const screenWidth = window.innerWidth;

    if (rect.left < 100) {
      this.transformOrigin = 'left center';
    } else if (rect.right > screenWidth - 100) {
      this.transformOrigin = 'right center';
    } else {
      this.transformOrigin = 'center center';
    }
  }

  ngOnDestroy() {
    clearTimeout(this.hoverTimeout);
  }
}
