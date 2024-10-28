import { Component, OnInit } from '@angular/core';
import { YtsService } from '../../services/yts.service';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../shared/card/card.component';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CardComponent, CommonModule, SkeletonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit  {
  loader = [1,2,3,4,5,6,7,8,9,9,9,9,9,9,9,9,9,7,7,8,6,4,5,6,4,6,6,6,7,77,7,7,7,7,7,7,7,7,7,7]
  query: any;
  movies:any = []
  loading:boolean = true
  constructor(
    private yts: YtsService,
    private route:ActivatedRoute

  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.query = params.get('query')
        this.findResults()
      }
    )
  }

  private findResults() {
    this.yts.Search(this.query).subscribe(
      (data: any) => {
        this.loading = false
        this.movies = data.data.movies
      },
      (error: any) => {
        console.error(error)
      }
    )
  }
}
