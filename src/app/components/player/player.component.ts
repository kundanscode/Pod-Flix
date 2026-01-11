import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PodcastService, Podcast } from '../../services/podcast.service';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="player-container" (mousemove)="onMouseMove()">
      <!-- Back Button -->
      <div class="back-nav" (click)="goBack()" [class.hidden]="!controlsVisible">
        <span class="icon">←</span> Back to Browse
      </div>

      <!-- Video Stage -->
      <div class="video-stage" (click)="togglePlay()">
        <div id="youtube-player"></div>
        <!-- Using div id for API injection or iframe with enablejsapi -->

        <!-- Pause Cover to hide YouTube UI -->
        @if (showPauseCover && podcast) {
        <div class="paused-cover">
          <img [src]="podcast.thumbnailUrl" class="cover-img" />
          <div class="cover-overlay"></div>
        </div>
        }
      </div>

      <!-- Custom Controls Overlay -->
      <div
        class="controls-overlay"
        [class.hidden]="!controlsVisible"
        (click)="$event.stopPropagation()"
      >
        <div class="controls-bottom">
          <button class="icon-btn" (click)="togglePlay()">
            {{ isPlaying ? '⏸' : '▶' }}
          </button>

          <!-- Fake Progress Bar (Visual Only for now as scrubbing requires complex event sync) -->
          <div class="progress-bar-container" (click)="onSeek($event)">
            <div class="progress-bar" [style.width.%]="fakeProgress"></div>
          </div>

          <div class="volume-controls">
            <button class="icon-btn" (click)="toggleMute()">
              {{ isMuted ? '🔇' : '🔊' }}
            </button>
          </div>

          @if (podcast) {
          <div class="title-info">
            {{ podcast.title }}
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit, OnDestroy {
  podcast: Podcast | undefined;
  player: any; // YT.Player

  isPlaying = false;
  isMuted = false;
  showPauseCover = false;
  controlsVisible = true;
  hideControlsTimeout: any;
  fakeProgress = 0;
  progressInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private podcastService: PodcastService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  // Keyboard Shortcuts
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.player) return;

    // Spacebar to Toggle Play
    if (event.code === 'Space') {
      event.preventDefault(); // Prevent page scroll
      this.togglePlay();
      this.onMouseMove(); // Show controls
    }

    // Arrow Left/Right to Seek
    if (event.code === 'ArrowRight') {
      const curr = this.player.getCurrentTime();
      this.player.seekTo(curr + 10, true);
      this.onMouseMove();
    }
    if (event.code === 'ArrowLeft') {
      const curr = this.player.getCurrentTime();
      this.player.seekTo(curr - 10, true);
      this.onMouseMove();
    }
  }

  onSeek(event: MouseEvent) {
    if (!this.player) return;
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;

    const duration = this.player.getDuration();
    const newTime = duration * percentage;

    this.player.seekTo(newTime, true);
    this.fakeProgress = percentage * 100;
  }

  ngOnInit() {
    this.loadYoutubeAPI();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.podcastService.getPodcastById(id).subscribe((p) => {
        this.podcast = p;
        this.startPlayer(id);
      });
    }
  }

  loadYoutubeAPI() {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }

  startPlayer(videoId: string) {
    // Wait for API
    const interval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(interval);
        this.initPlayer(videoId);
      }
    }, 100);
  }

  initPlayer(videoId: string) {
    this.player = new window.YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0, // Hide Native Controls
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        disablekb: 1,
      },
      events: {
        onReady: (event: any) => {
          this.ngZone.run(() => {
            this.isPlaying = true;
            this.isMuted = this.player.isMuted();
            event.target.playVideo();
            this.startProgressTracker();
            this.resetInactivityTimer();
          });
        },
        onStateChange: (event: any) => {
          this.ngZone.run(() => {
            // YT.PlayerState: 1 = PLAYING, 2 = PAUSED, 0 = ENDED
            const state = event.data;
            this.isPlaying = state === 1;
            // Show cover only when explicitly paused or ended to hide YouTube UI
            this.showPauseCover = state === 2 || state === 0;
          });
        },
      },
    });
  }

  togglePlay() {
    if (!this.player) return;
    if (this.isPlaying) {
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
    this.isPlaying = !this.isPlaying;
    this.resetInactivityTimer();
  }

  toggleMute() {
    if (!this.player) return;
    if (this.player.isMuted()) {
      this.player.unMute();
      this.isMuted = false;
    } else {
      this.player.mute();
      this.isMuted = true;
    }
  }

  onMouseMove() {
    this.controlsVisible = true;
    this.resetInactivityTimer();
  }

  resetInactivityTimer() {
    clearTimeout(this.hideControlsTimeout);
    this.hideControlsTimeout = setTimeout(() => {
      if (this.isPlaying) {
        this.controlsVisible = false;
      }
    }, 3000);
  }

  startProgressTracker() {
    this.progressInterval = setInterval(() => {
      if (this.player && this.isPlaying) {
        const current = this.player.getCurrentTime();
        const total = this.player.getDuration();
        if (total > 0) {
          this.fakeProgress = (current / total) * 100;
          this.cdr.detectChanges(); // Update UI
        }
      }
    }, 1000);
  }

  goBack() {
    this.router.navigate(['/browse']);
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
    }
    clearInterval(this.progressInterval);
    clearTimeout(this.hideControlsTimeout);
  }
}
