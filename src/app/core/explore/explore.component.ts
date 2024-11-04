import { Component } from '@angular/core';
import { CardComponent } from '../../shared/card/card.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { YtsService } from '../../services/yts.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ListComponent} from '../../shared/list/list.component';
@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CardComponent, RouterModule, CommonModule, CarouselModule, ButtonModule, SkeletonModule, SelectButtonModule, FormsModule, ListComponent],
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent {
  loader = [1,2,3,4,5,6,7,8,9,9,9,9,9,9,9,9,9,7,7,8,6,4,5,6,4,6,6,6,7,77,7,7,7,7,7,7,7,7,7,7]
  loading:boolean = true
  movies: any = [];
  totalMovies: any = 0;
  page: number = 1; // Changed from 'Number' to 'number'
  totalPages!: number; // Changed from 'Number' to 'number'
  private subscription: Subscription = new Subscription(); // Initialize a Subscription object

  constructor(private yts: YtsService) {}

  viewOptions = [
    { label: 'List View', value: 'list', icon: 'pi pi-list' },
    { label: 'Grid View', value: 'grid', icon: 'pi pi-th-large' }
  ];
  selectedView: string = 'list';


  ngOnInit(): void {
    this.initMovies();
  }

  private initMovies() {
    const moviesSubscription = this.yts.getmoviesbypage(this.page).subscribe(
      (data: any) => {
        this.totalMovies = data.data.movie_count;
        this.loading = false
        this.movies = data.data.movies;
        this.calcPages();
      },
      (error) => {
        console.error(error);
      }
    );
    this.subscription.add(moviesSubscription); // Add the subscription to the Subscription object
  }

   calcPages() {
    this.totalPages = Math.ceil(this.totalMovies / 50);
    console.log(this.totalPages);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Unsubscribe from all subscriptions
  }

  nextPage() {
    this.page = this.page + 1; // No error now since 'page' is a number
    this.initMovies();
  }

  prevPage() {
    this.page = this.page - 1; // Fixed to subtract instead of add
    this.initMovies();
  }

  firstPage() {
    this.page = 1;
    this.initMovies();
  }

  lastPage() {
    this.page = this.totalPages;
    this.initMovies();
  }
}
