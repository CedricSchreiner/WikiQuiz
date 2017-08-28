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
        for (let j = 1; j < 6; j++) {
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
      row = (<HTMLTableRowElement>document.getElementById('statsTableOverwallHeader'));
      row.bgColor = '#4286f4';
      this.stats = stats;
      for (let i = 0; i < 10; i++) {
        ///======================================================
        header = table.createTHead();
        row = header.insertRow(i + 1);
        cell = row.insertCell(0);
        cell.innerHTML = '<b>' + String(i + 1) + '.</b>';
        for (let j = 1; j < 6; j++) {
          cell = row.insertCell(j);
          cell.width = '100px';
          if (this.stats.length >= i) {
            cell.innerHTML = this.get(i, j);
          }
          if ((i % 2) === 0) {
            row.bgColor = '#f9fafc';
          }else {
            row.bgColor = '#eaf0f9';
          }
        }
        ///=======================================================
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
      return String(this.stats[index].punktZahl);
    } else if (indexAttribute === 5) {
      return String(this.stats[index].userId);
    }
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
