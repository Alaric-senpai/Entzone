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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CardModule, TagModule, BreadcrumbModule, AccordionModule, CardComponent, ButtonModule, CommonModule, RouterModule, SkeletonModule, ToastModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  providers: [MessageService]
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
    private sanitizer: DomSanitizer, 
    private ms:MessageService
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
      'udp://tracker.openbittorrent.com:80',
      'udp://torrent.gresille.org:80/announce',
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.coppersurfer.tk:6969',
      'udp://tracker.leechers-paradise.org:6969',
      'udp://p4p.arenabg.ch:1337'
    ];

    // Construct the tracker string
    const trackerString = trackers.map(tr => `&tr=${encodeURIComponent(tr)}`).join('');

    // Combine all parts to form the complete magnet link
    const magnetLink = `${baseMagnet}${hash}&dn=${name}${trackerString}`;
    
    return magnetLink;
  }

  downloadTorrent(torrent:any){
    const link = this.generateMagnetLink(torrent);

    window.open(link, '_blank')
  }

  generateCopyLink(torrent:any){
    const link = this.generateMagnetLink(torrent)
    navigator.clipboard.writeText(link).then(() => {
      this.ms.add(
      {
        icon: 'pi pi-check',
        severity: 'success',
        summary: 'Copy successfull',
        detail: 'Magnet link copied succesfully',
        styleClass: 'p-2'
      })
    }).catch(err => {
            this.ms.add(
      {
        icon: 'pi pi-check',
        summary: 'Copy failed',
        detail: 'Magnet link no copied try again',
        styleClass: 'p-2',
        severity: 'error'
      })
    });
  }  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
