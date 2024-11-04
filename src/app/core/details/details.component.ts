import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
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
import { SEOService } from 'ngx-seo-helper';
import { PanelModule } from 'primeng/panel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CardModule, TagModule, BreadcrumbModule, AccordionModule, CardComponent, ButtonModule, CommonModule, RouterModule, SkeletonModule, ToastModule, PanelModule, ScrollPanelModule,],
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

  items: MenuItem[] | undefined;

    home: MenuItem | undefined;

  constructor(
    private route: ActivatedRoute,
    private yts: YtsService,
    private sanitizer: DomSanitizer, 
    private ms:MessageService,
    private seo:SEOService
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
        this.setSeo()
        this.getRelatedShows();
        this.setBreadcrumb()
      },
      (err) => {
        console.log(err);
      }
    );

    this.subscription.add(moviedata);
  }

  setBreadcrumb(){
    this.items = [
    {
      icon: 'pi pi-home',
      route: '/home'
    },
    {
      label: 'Explore',
      route: '/explore'
    },
    {
      label: this.show.title_english,
    }
    ]
  }

  setSeo() {
    this.seo.updateMetaTags(
      {
        title: this.show.title_english || this.show.title,
        description: this.show.description_into || this.show.description_full || "Description not set fot this page",
        keywords : this.show.genres,
        author: 'Entzonex',
        imageUrl: this.show.medium_cover_image,
        url: `https://entzonex.web.app/info/${this.showid}`,
        robots: 'follow, index'
      }
    )

    this.seo.setTwitterTags(
      {
        cardType: 'summary_large_card',
        title: this.show.title_english || this.show.title,
        creator: 'Entzonex',
        description: this.show.description_into || this.show.description_full || "Description not set fot this page",
        image: this.show.meduim_cover_image
     
     }

    )

    this.seo.setRobotsTag('follow, index');


    this.seo.auditSEO()
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
