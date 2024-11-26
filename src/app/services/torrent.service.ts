import { Injectable } from '@angular/core';
import WebTorrent from 'webtorrent';

@Injectable({
  providedIn: 'root',
})
export class TorrentService {
  private client: any;

  constructor() {
    this.client = new WebTorrent();
  }

  streamTorrent(magnetURI: string, callback: (streamURL: string) => void): void {
    this.client.add(magnetURI, (torrent: any) => {
      console.log('Torrent added:', torrent);

      // Find the first playable video file
      const file = torrent.files.find((f: any) =>
        f.name.endsWith('.mp4') || f.name.endsWith('.mkv')
      );

      if (file) {
        console.log('Streaming file:', file.name);

        // Create a Blob URL for the file
        file.getBlobURL((err: any, url: string) => {
          if (err) {
            console.error('Error creating Blob URL:', err);
            return;
          }
          callback(url); // Pass the Blob URL to the callback
        });
      } else {
        console.error('No playable video files found in this torrent.');
      }
    });
  }

  destroyClient(): void {
    this.client.destroy(() => console.log('WebTorrent client destroyed'));
  }
}
