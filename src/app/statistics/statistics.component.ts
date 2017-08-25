import {Component, OnInit } from '@angular/core';
import { RestService } from '../service/rest.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  stats: Statistic[];
  avatarLinkString: string;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.avatarLinkString = './assets/' + sessionStorage.getItem('link');
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
        cell.innerHTML = '<b>' + String(i + 1) + '.</b>';
        for (let j = 1; j < 7; j++) {
          cell = row.insertCell(j);
          cell.width = '100px';
          if (this.stats.length > i) {
            cell.innerHTML = this.get(i, j);
          }
        }
      }
    }));
  }

  createTopTenOverallTable() {
    let cell: HTMLTableCellElement;
    let header: HTMLTableSectionElement;
    let row: HTMLTableRowElement;
    const table = (<HTMLTableElement>document.getElementById('statsTableOverall'));
    this.restService.getTopTenStatisticsOverall().subscribe((stats => {
      header = table.createTHead();
      row = header.insertRow(0);
      cell = row.insertCell(0);
      cell.innerHTML = 'Platz';
      cell = row.insertCell(1);
      cell.innerHTML = 'Fragenanzahl';
      cell = row.insertCell(2);
      cell.innerHTML = 'Richtige Antworten';
      cell = row.insertCell(3);
      cell.innerHTML = 'Gespielte Spiele';
      cell = row.insertCell(4);
      cell.innerHTML = 'Punkte';
      cell = row.insertCell(5);
      cell.innerHTML = 'ID';
      this.stats = stats;
      for (let i = 0; i < 10; i++) {
        header = table.createTHead();
        row = header.insertRow(i + 1);
        cell = row.insertCell(0);
        cell.innerHTML = '<b>' + String(i + 1) + '.</b>';
        for (let j = 1; j < 7; j++) {
          cell = row.insertCell(j);
          cell.width = '100px';
          if (this.stats.length >= i) {
            cell.innerHTML = this.get(i, j);
          }
        }
      }
      console.log(table);
    }));
  }

  get(index: number, indexAttribute) {
    if (indexAttribute === 1) {
      return String(this.stats[index].anzahlFragen);
    } else if (indexAttribute === 2) {
      return String(this.stats[index].fragenRichtig);
    } else if (indexAttribute === 3) {
      return String(this.stats[index].anzahlSpiele);
    } else if (indexAttribute === 4) {
      return this.stats[index].gameMode;
    } else if (indexAttribute === 5) {
      return String(this.stats[index].punktZahl);
    } else if (indexAttribute === 6) {
      return String(this.stats[index].userId);
    }
  }

  logout() {
    sessionStorage.clear();
  }

  link(linkToGo: string) {
    window.location.href = linkToGo;
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
