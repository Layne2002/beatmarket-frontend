import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of } from 'rxjs';
import { environments } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class AlbumService {
  private apiKey = environments.apiKey;
  private apiUrl = 'https://ws.audioscrobbler.com/2.0/';

  constructor(private http: HttpClient) {}

  getAlbumImage(artist: string, album: string) {
    if (!artist || !album) return of(null);

    const url = `${this.apiUrl}?method=album.getinfo&api_key=${this.apiKey}&artist=${encodeURIComponent(
      artist
    )}&album=${encodeURIComponent(album)}&format=json`;

    return this.http.get<any>(url).pipe(
      map((res) => {
        const images = res?.album?.image;
        const img = images?.find((img: any) => img.size === 'extralarge') || images?.pop();
        return img?.['#text'] || null;
      })
    );
  }
  getAlbumInfo(artist: string, album: string) {
    if (!artist || !album) return of(null);

    const url = `${this.apiUrl}?method=album.getinfo&api_key=${this.apiKey}&artist=${encodeURIComponent(
      artist
    )}&album=${encodeURIComponent(album)}&format=json`;

    return this.http.get<any>(url).pipe(
      map((res) => res?.album || null)
    );
  }
  getTrendingArtists(limit: number = 50) {
    const topArtistsUrl = `${this.apiUrl}?method=chart.gettopartists&api_key=${this.apiKey}&format=json&limit=${limit}`;

    return this.http.get<any>(topArtistsUrl).pipe(
      map(res => res?.artists?.artist || []),
      map(artists => artists.slice(0, limit)),
      map(artists => artists.map((artist: any) => artist.name))
    );
  }


  getTopAlbumsByArtist(artist: string, limit: number = 3) {
    if (!artist) return of([]);

    const url = `${this.apiUrl}?method=artist.gettopalbums&artist=${encodeURIComponent(artist)}&api_key=${this.apiKey}&format=json&limit=${limit}`;

    return this.http.get<any>(url).pipe(
      map(res => res?.topalbums?.album || [])
    );
  }
}