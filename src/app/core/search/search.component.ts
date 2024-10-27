import { Component, OnInit } from '@angular/core';
import { YtsService } from '../../services/yts.service';
import { ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../shared/card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CardComponent, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit  {
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
