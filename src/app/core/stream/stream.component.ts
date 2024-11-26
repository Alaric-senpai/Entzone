import { Component, OnInit, OnDestroy } from '@angular/core';
// import { TorrentService } from '../../services/torrent.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stream',
  standalone: true,
  imports: [],
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
})
export class StreamComponent implements OnInit, OnDestroy {
  streamUrl: string = '';
  showid: any;
  magnet: string | null = null;

  constructor(
    // private torrent: TorrentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // this.route.paramMap.subscribe((params) => {
    //   this.showid = params.get('id');
    //   this.magnet = params.get('magnet');

    //   if (this.magnet) {
    //     this.torrent.streamTorrent(this.magnet, (streamUrl: string) => {
    //       this.streamUrl = streamUrl;
    //       console.log('Streaming URL:', this.streamUrl);
    //     });
    //   } else {
    //     console.error('Magnet link not provided.');
    //   }
    // });
  }

  ngOnDestroy(): void {
    // this.torrent.destroyClient();
  }
}
