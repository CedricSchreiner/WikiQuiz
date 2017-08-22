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
    this.createTopTenPlayer();
    this.createTopTenOverallTable();
  }

  createTopTenPlayer() {
    let cell: HTMLTableCellElement;
    let header: HTMLTableSectionElement;
    let row: HTMLTableRowElement;
    const table = (<HTMLTableElement>document.getElementById('statsTableProfile'));
    this.restService.getTopTenStatisticsPlayer().subscribe((stats => {
      console.log(stats);
      this.stats = stats;
      for (let i = 0; i < 10; i++) {
        header = table.createTHead();
        row = header.insertRow(i);
        cell = row.insertCell(0);
        cell.innerHTML = stats[i].anzahlFragen;
        cell = row.insertCell(1);
        cell.innerHTML = stats[i].fragenRichtig;
        cell = row.insertCell(2);
        cell.innerHTML = stats[i].anzahlSpiele;
        cell = row.insertCell(3);
        cell.innerHTML = stats[i].gameMode;
        cell = row.insertCell(4);
        cell.innerHTML = stats[i].punktZahl;
        cell = row.insertCell(5);
        cell.innerHTML = stats[i].userId;
      }
    }));
  }

  createTopTenOverallTable() {
    let cell: HTMLTableCellElement;
    let header: HTMLTableSectionElement;
    let row: HTMLTableRowElement;
    const table = (<HTMLTableElement>document.getElementById('statsTableOverall'));
    this.restService.getTopTenStatisticsOverall().subscribe((stats => {
      console.log(stats);
      this.stats = stats;
      for (let i = 0; i < 10; i++) {
        header = table.createTHead();
        row = header.insertRow(i);
        cell = row.insertCell(0);
        cell.innerHTML = stats[i].anzahlFragen;
        cell = row.insertCell(1);
        cell.innerHTML = stats[i].fragenRichtig;
        cell = row.insertCell(2);
        cell.innerHTML = stats[i].anzahlSpiele;
        cell = row.insertCell(3);
        cell.innerHTML = stats[i].gameMode;
        cell = row.insertCell(4);
        cell.innerHTML = stats[i].punktZahl;
        cell = row.insertCell(5);
        cell.innerHTML = stats[i].userId;
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
