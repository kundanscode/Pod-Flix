import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Podcast } from '../../services/podcast.service';
import { VideoCardComponent } from '../video-card/video-card.component';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, VideoCardComponent],
  template: `
    <div class="carousel-container" *ngIf="podcasts.length > 0">
      <h2 class="carousel-title">{{ title }}</h2>

      <div class="carousel-wrapper">
        <button class="nav-btn prev" (click)="scroll('left')" *ngIf="showLeftArrow">‹</button>

        <div class="carousel-track" #track (scroll)="checkScroll()">
          <div class="carousel-item" *ngFor="let podcast of podcasts">
            <app-video-card [podcast]="podcast"></app-video-card>
          </div>
        </div>

        <button class="nav-btn next" (click)="scroll('right')" *ngIf="showRightArrow">›</button>
      </div>
    </div>
  `,
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent {
  @Input() title: string = '';
  @Input() podcasts: Podcast[] = [];

  @ViewChild('track') track!: ElementRef<HTMLDivElement>;

  showLeftArrow = false;
  showRightArrow = true;

  scroll(direction: 'left' | 'right') {
    const trackEl = this.track.nativeElement;
    const scrollAmount = trackEl.clientWidth * 0.8; // Scroll 80% of view width

    if (direction === 'left') {
      trackEl.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      trackEl.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  checkScroll() {
    const trackEl = this.track.nativeElement;
    this.showLeftArrow = trackEl.scrollLeft > 0;

    // Allow a small buffer (5px) for floating point calculations
    const maxScroll = trackEl.scrollWidth - trackEl.clientWidth;
    this.showRightArrow = trackEl.scrollLeft < maxScroll - 5;
  }
}
