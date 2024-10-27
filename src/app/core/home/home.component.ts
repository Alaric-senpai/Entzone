import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardComponent } from '../../shared/card/card.component';
import { YtsService } from '../../services/yts.service';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TagModule, ButtonModule, CardComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  movies: any = [];
  totalmovies = 50;
  activemovie: number = 0; // Start from 0 to align with the index of the movies array
  selectedmovie: any;
  private subscription: Subscription = new Subscription();
  private intervalId: any;

  constructor(private yts: YtsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.GetMovies();

    // Set up interval to switch active movie every 45 seconds (45000 milliseconds)
    this.intervalId = setInterval(() => {
      this.switchActive();
    }, 45000);
  }

  private switchActive(): void {
    this.activemovie = (this.activemovie + 1) % this.totalmovies; // Loop back to 0 after reaching totalmovies
    this.selectedmovie = this.movies[this.activemovie];
    this.cdr.markForCheck(); // Ensure view is updated when selectedmovie changes
  }

  private GetMovies(): void {
    this.yts.getmovies().subscribe(
      (data: any) => {
        this.movies = data.data.movies;
        this.totalmovies = this.movies.length; // Update totalmovies to the actual length of movies fetched
        this.selectedmovie = this.movies[this.activemovie];
        this.cdr.markForCheck(); // Ensure initial view update
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Clear interval when component is destroyed
    this.subscription.unsubscribe(); // Unsubscribe from all subscriptions
  }
}
