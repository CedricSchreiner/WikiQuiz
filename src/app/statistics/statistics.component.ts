import {Component, OnInit } from '@angular/core';
import { RestService } from '../service/rest.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  stats: Statistic[];
  table: HTMLTableElement;
  cell: HTMLTableCellElement;
  header: HTMLTableSectionElement;
  row: HTMLTableRowElement;
  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.table = (<HTMLTableElement>document.getElementById('statsTable'));
    this.restService.getTopTenStatisticsOverall().subscribe((stats => {
      console.log(stats);
      this.stats = stats;
      for (let i = 0; i < 10; i++) {
        this.header = this.table.createTHead();
        this.row = this.header.insertRow(i);
          this.cell = this.row.insertCell(0);
          this.cell.innerHTML = stats[i].anzahlFragen;
          this.cell = this.row.insertCell(1);
          this.cell.innerHTML = stats[i].fragenRichtig;
          this.cell = this.row.insertCell(2);
          this.cell.innerHTML = stats[i].anzahlSpiele;
          this.cell = this.row.insertCell(3);
          this.cell.innerHTML = stats[i].gameMode;
          this.cell = this.row.insertCell(4);
          this.cell.innerHTML = stats[i].punktZahl;
          this.cell = this.row.insertCell(5);
          this.cell.innerHTML = stats[i].userId;
      }
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
