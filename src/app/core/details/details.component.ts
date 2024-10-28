import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { CardComponent } from '../../shared/card/card.component';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { YtsService } from '../../services/yts.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Import DomSanitizer
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CardModule, TagModule, BreadcrumbModule, AccordionModule, CardComponent, ButtonModule, CommonModule, RouterModule, SkeletonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit, OnDestroy {
  loader = [1,2,3,4,5,6,7,8]
  private subscription: Subscription = new Subscription();
  loading:boolean = true
  relatedloading: boolean  = true
  showid: any;
  show: any;
  relatedShows: any = [];

  constructor(
    private route: ActivatedRoute,
    private yts: YtsService,
    private sanitizer: DomSanitizer // Inject DomSanitizer
  ) { }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.showid = params.get('id');
        this.getMovieData();
      }
    );
  }

  private getMovieData() {
    const moviedata = this.yts.getmoviesdetails(this.showid).subscribe(
      (data: any) => {
        this.show = data.data.movie;
        this.loading = false
        this.getRelatedShows();
      },
      (err) => {
        console.log(err);
      }
    );

    this.subscription.add(moviedata);
  }

  private getRelatedShows() {
    const relatedShow = this.yts.getSimilar(this.showid).subscribe(
      (data: any) => {
        this.relatedShows = data.data.movies;
        this.relatedloading = false
      },
      (error) => {
        console.log(error);
      }
    );

    this.subscription.add(relatedShow);
  }

  getYoutubeEmbedUrl(videoId: string): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url); // Sanitize the URL
  }
  
  generateMagnetLink(data: any) {
    const baseMagnet = 'magnet:?xt=urn:btih:';
    const hash = data.hash; // Torrent hash
    const name = encodeURIComponent(data.url.split('/').pop()); // Extract and URL-encode the movie name from the URL
    const trackers = [
      'udp://open.demonii.com:1337/announce',
      'udp://tracker.openbittorrent.com:80'
    ];

    // Construct the tracker string
    const trackerString = trackers.map(tr => `&tr=${encodeURIComponent(tr)}`).join('');

    // Combine all parts to form the complete magnet link
    const magnetLink = `${baseMagnet}${hash}&dn=${name}${trackerString}`;
    
    return magnetLink;
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
