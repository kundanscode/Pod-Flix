import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
      <div class="category-header">
        <h1>{{ currentCategory || 'Browse' }}</h1>
      </div>

      <div class="grid">
        <div class="card-wrapper" *ngFor="let podcast of podcasts">
          <app-video-card [podcast]="podcast"></app-video-card>
        </div>
      </div>

      <!-- Netflix Style Pagination -->
      <div class="pagination" *ngIf="totalPages > 1">
        <button class="nav-btn" (click)="prevPage()" [disabled]="currentPage === 0">
          <span class="icon">‹</span> Previous
        </button>

        <!-- Optional: Page indicator like '1 of 5' or just buttons -->
        <div class="page-info">{{ currentPage + 1 }} ... {{ totalPages }}</div>

        <button class="nav-btn" (click)="nextPage()" [disabled]="currentPage === totalPages - 1">
          Next <span class="icon">›</span>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./browse.component.css'],
})
export class BrowseComponent implements OnInit {
  podcasts: Podcast[] = [];
  currentPage = 0;
  totalPages = 0;
  itemsPerPage = 25;
  currentCategory: string | undefined;

  constructor(
    private podcastService: PodcastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.currentCategory = params['category'];
      this.currentPage = 0;
      this.loadPodcasts();
    });
  }

  loadPodcasts() {
    // If no category selected, maybe show 'Technology' or 'All'?
    // Given the prompt, it seems it should be category based.
    // If undefined, let's query for 'Technology' as default or handle 'All' logic if service supports it.
    // For now passing currentCategory.

    // Fallback: if no category, maybe redirect to Home or use a default?
    // Let's assume we show everything if no category is present, or a default one.
    const categoryToFetch = this.currentCategory || 'Technology';

    this.podcastService
      .getPodcasts(this.currentPage, this.itemsPerPage, categoryToFetch)
      .subscribe((data) => {
        this.podcasts = data.content;
        this.totalPages = data.totalPages;
        window.scrollTo(0, 0);
      });
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPodcasts();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPodcasts();
    }
  }
}
