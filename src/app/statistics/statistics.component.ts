import {Component, OnInit } from '@angular/core';
import { RestService } from '../service/rest.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  stats: Statistic[];
  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.restService.getTopTenStatisticsOverall().subscribe((stats => {
      console.log(stats);
      this.stats = stats;
    }));
  }
}

interface Statistic {
  anzahlFragen: number;
  anzahlSpiele: number;
  fragenRichtig: number;
  gameMode: string;
  punktZahl: number;
  userId: number;
}
