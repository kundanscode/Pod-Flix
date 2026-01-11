import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PodcastService, Podcast } from '../../services/podcast.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="player-container">
      <div class="back-nav" (click)="goBack()"><span class="icon">←</span> Back to Browse</div>

      <div class="video-stage" *ngIf="podcast; else loading">
        <video [src]="podcast.videoUrl" controls autoplay class="main-video"></video>
        <div class="video-info-overlay">
          <h1>{{ podcast.title }}</h1>
          <p>{{ podcast.description }}</p>
        </div>
      </div>

      <ng-template #loading>
        <div class="loading">Loading...</div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  podcast: Podcast | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private podcastService: PodcastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.podcastService.getPodcastById(id).subscribe((p) => {
        if (p) {
          this.podcast = p;
        } else {
          // Handle not found
          this.goBack();
        }
      });
    }
  }

  goBack() {
    // Navigate back to history or browse
    // window.history.back(); // Simple browser back
    // Or safer:
    this.router.navigate(['/browse']);
  }
}
