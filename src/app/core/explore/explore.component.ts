import { Component } from '@angular/core';
import { CardComponent } from '../../shared/card/card.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { YtsService } from '../../services/yts.service';
import { Subscription } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CardComponent, RouterModule, CommonModule, CarouselModule, ButtonModule],
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent {

  movies: any = [];
  totalMovies: any = 0;
  page: number = 1; // Changed from 'Number' to 'number'
  totalPages!: number; // Changed from 'Number' to 'number'
  private subscription: Subscription = new Subscription(); // Initialize a Subscription object

  constructor(private yts: YtsService) {}

  ngOnInit(): void {
    this.initMovies();
  }

  private initMovies() {
    const moviesSubscription = this.yts.getmoviesbypage(this.page).subscribe(
      (data: any) => {
        this.totalMovies = data.data.movie_count;
        this.movies = data.data.movies;
        this.calcPages();
      },
      (error) => {
        console.error(error);
      }
    );
    this.subscription.add(moviesSubscription); // Add the subscription to the Subscription object
  }

  private calcPages() {
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
