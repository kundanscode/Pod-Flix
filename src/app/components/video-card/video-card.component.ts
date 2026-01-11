import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
      (click)="playFullVideo()"
      [class.is-hovered]="showPopup"
    >
      <!-- Base Card (Thumbnail) -->
      <div class="base-card">
        <img [src]="podcast.thumbnailUrl" [alt]="podcast.title" loading="lazy" />
        <h3 class="title-overlay" *ngIf="!showPopup">{{ podcast.title }}</h3>
      </div>

      <!-- Popup Card (Video Player) -->
      <div class="popup-card" *ngIf="showPopup" [style.transform-origin]="transformOrigin">
        <div class="video-wrapper">
          <video
            #videoPlayer
            [src]="podcast.videoUrl"
            [muted]="isMuted"
            autoplay
            loop
            playsinline
          ></video>
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
    </div>
  `,
  styleUrls: ['./video-card.component.css'],
})
export class VideoCardComponent implements OnDestroy {
  @Input() podcast!: Podcast;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  showPopup = false;
  isMuted = true;
  hoverTimeout: any;
  transformOrigin = 'center center';

  constructor(private cdr: ChangeDetectorRef, private el: ElementRef, private router: Router) {}

  onMouseEnter() {
    this.hoverTimeout = setTimeout(() => {
      this.calculateTransformOrigin();
      this.showPopup = true;
      this.cdr.detectChanges(); // Force check to render video tag
      if (this.videoPlayer) {
        this.videoPlayer.nativeElement.play().catch((e) => console.log('Autoplay blocked', e));
      }
    }, 600); // 600ms delay like Netflix
  }

  onMouseLeave() {
    clearTimeout(this.hoverTimeout);
    this.showPopup = false;
  }

  toggleMute(event: Event) {
    event.stopPropagation();
    this.isMuted = !this.isMuted;
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
