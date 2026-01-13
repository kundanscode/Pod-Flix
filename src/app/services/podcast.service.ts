import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

export interface Podcast {
  id: string; // Mapped from videoId
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string; // Placeholder or constructed
  category: string;
  publishedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PodcastService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFeatured(): Observable<Podcast> {
    // For now, fetch 'technology' and pick first for featured/hero
    // or create a specific endpoint later.
    return this.getPodcasts(0, 1, 'technology').pipe(map((res) => res.content[0]));
  }

  getTrending(): Observable<Podcast[]> {
    // Fetch 'home' or specific trending category
    return this.getPodcasts(0, 25, 'home').pipe(map((res) => res.content));
  }

  getPodcastsByCategory(category: string, size: number = 25): Observable<Podcast[]> {
    return this.getPodcasts(0, size, category).pipe(map((res) => res.content));
  }

  getPodcasts(page: number, size: number, category?: string): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);

    if (category) {
      // Backend expects lowercase or specific casing? User URL example: ?category=home
      // Frontend categories are 'Technology', 'Finance'.
      // Sending lowercase to be safe/consistent with example.
      params = params.set('category', category.toLowerCase());
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map((response) => {
        const content = response.content.map((item: any) => ({
          id: item.videoId,
          title: item.title,
          description: item.description,
          thumbnailUrl: item.thumbnailUrl,
          // Placeholder video for hover preview since backend doesn't provide playable url
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          category: item.category,
          publishedAt: item.publishedAt,
        }));
        return {
          ...response,
          content: content,
        };
      })
    );
  }

  getPodcastById(id: string): Observable<Podcast | undefined> {
    // Current backend requirement doesn't specify single ID endpoint.
    // Try to generic search or this feature might be pending backend update.
    // For now, we will assume we can't easily get it without searching the list.
    // Hack: Fetch 'home' or 'all' and find? No, that's bad.
    // Better: Try to call /api/podcasts/ID?
    // I'll try a common convention: api/podcasts/{id}
    // If it fails, the player page will just not load.

    // NOTE: This might fail if endpoint doesn't exist.
    /* 
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
         map(item => ({
             id: item.videoId,
             title: item.title,
             description: item.description,
             thumbnailUrl: item.thumbnailUrl,
             videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
             category: item.category,
             publishedAt: item.publishedAt
         }))
    );
    */

    // Temporary fallback: Return empty or handle error.
    // Since Step 1 is just connect the list...
    console.warn('getPodcastById not fully implemented with backend yet.');
    return of(undefined);
  }
}
