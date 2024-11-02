import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CardModule, RouterModule, CommonModule, ButtonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() image: any;
  @Input() name: any;
  @Input() id: any;
  @Input() genres: any;

  genresclip: any[] = [];

  ngOnInit() {
    this.genresclip = this.genres?.slice(0, 3) || [];
  }
}
