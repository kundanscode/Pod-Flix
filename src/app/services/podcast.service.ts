import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Podcast {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class PodcastService {
  // Mock Data
  private mockPodcasts: Podcast[] = [];

  constructor() {
    this.generateMockData();
  }

  private generateMockData() {
    // Categories matching user request + Navbar
    const categories = ['Technology', 'Finance', 'Health', 'Travel'];
    const images = [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=800&q=80',
    ];

    for (let i = 1; i <= 200; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const img = images[Math.floor(Math.random() * images.length)];
      this.mockPodcasts.push({
        id: i.toString(),
        title: `${cat} Podcast #${i}`,
        description: `This is a description for podcast number ${i}. It covers interesting topics about ${cat}.`,
        thumbnailUrl: img,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        category: cat,
      });
    }
  }

  getFeatured(): Observable<Podcast> {
    return of(this.mockPodcasts[0]);
  }

  getTrending(): Observable<Podcast[]> {
    // Return random 25 items as trending
    return of(this.mockPodcasts.slice(0, 25));
  }

  getPodcastsByCategory(category: string, size: number = 25): Observable<Podcast[]> {
    const filtered = this.mockPodcasts.filter((p) => p.category === category);
    return of(filtered.slice(0, size));
  }

  getPodcasts(page: number, size: number, category?: string): Observable<any> {
    // Mock Pagination & Filtering
    let filtered = this.mockPodcasts;
    if (category && category !== 'All') {
      filtered = this.mockPodcasts.filter((p) => p.category === category);
    }

    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / size);

    const start = page * size;
    const end = start + size;
    const content = filtered.slice(start, end);

    return of({
      content: content,
      totalPages: totalPages,
      totalElements: totalElements,
      number: page,
    });
  }

  getPodcastById(id: string): Observable<Podcast | undefined> {
    const podcast = this.mockPodcasts.find((p) => p.id === id);
    return of(podcast);
  }
}
