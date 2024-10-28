import { Component, OnInit } from '@angular/core';
import { YtsService } from '../../services/yts.service';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [CardComponent, CommonModule, ButtonModule, SkeletonModule],
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.scss'
})
export class GenreComponent implements OnInit {
  loader = [1,2,3,4,5,6,7,8,9,9,9,9,9,9,9,9,9,7,7,8,6,4,5,6,4,6,6,6,7,77,7,7,7,7,7,7,7,7,7,7]

  genre: any;
  movies:any = []
  loading:boolean = true
  totalMovies: any = 0;
  page: number = 1; // Changed from 'Number' to 'number'
  totalPages!: number; // Changed from 'Number' to 'number'
  constructor(
    private yts: YtsService,
    private route:ActivatedRoute

  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.genre = params.get('genre')
        this.initMovies()
      }
    )
  }

  private calcPages() {
    this.totalPages = Math.ceil(this.totalMovies / 50);
    console.log(this.totalPages);
  }

  private initMovies() {
    this.yts.findByGenre(this.genre, this.page).subscribe(
      (data: any) => {
        this.loading = false
        // console.log(data)
        this.totalMovies = data.data.movie_count
        this.movies = data.data.movies
        this.calcPages()
      },
      (error: any) => {
        console.error(error)
      }
    )
  }
    nextPage() {
    this.page = this.page + 1; // No error now since 'page' is a number
    this.loading = true
    this.initMovies();
  }

  prevPage() {
    this.page = this.page - 1; // Fixed to subtract instead of add
    this.loading = true
    this.initMovies();
  }

  firstPage() {
    this.page = 1;
    this.loading = true
    this.initMovies();
  }

  lastPage() {
    this.page = this.totalPages;
    this.loading = true
    this.initMovies();
  }
}
