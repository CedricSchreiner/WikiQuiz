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
    this.createTopTenPlayerXquiz();
    this.createTopTenOverallTableXquiz();
    this.createTopTenPlayerSurvival();
    this.createTopTenOverallSurvival();
  }

  createTopTenPlayerXquiz() {
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    const table = (<HTMLTableElement>document.getElementById('stats-table-persoanl-xquiz'));
    this.restService.getTopTenStatisticsPlayer('xquiz').subscribe((stats => {
      this.stats = stats;
      row = table.rows[0];
      for (let i = 1; i < 11; i++) {
        row = table.rows[i];
        cell = row.cells[0];
        cell.innerHTML = String(i + '.');
        for (let j = 1; j < 4; j++) {
          cell = row.cells[j];
          if (this.stats.length >= i) {
            cell.innerHTML = this.get(i - 1, j);
          } else {
            cell.innerHTML = '-';
          }
        }
      }
    }));
  }

  createTopTenPlayerSurvival() {
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    const table = (<HTMLTableElement>document.getElementById('stats-table-personal-survival'));
    this.restService.getTopTenStatisticsPlayer('survival').subscribe((stats => {
      this.stats = stats;
      row = table.rows[0];
      for (let i = 1; i < 11; i++) {
        row = table.rows[i];
        cell = row.cells[0];
        cell.innerHTML = String(i + '.');
        for (let j = 1; j < 4; j++) {
          cell = row.cells[j];
          if (this.stats.length >= i) {
            cell.innerHTML = this.get(i - 1, j);
          } else {
            cell.innerHTML = '-';
          }
        }
      }
    }));
  }

  createTopTenOverallTableXquiz() {
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    const table = (<HTMLTableElement>document.getElementById('stats-table-world-xquiz'));
    this.restService.getTopTenStatisticsOverall('xquiz').subscribe((stats => {
      this.stats = stats;
      row = table.rows[0];
      for (let i = 1; i < 11; i++) {
        row = table.rows[i];
        cell = row.cells[0];
        cell.innerHTML = String(i + '.');
        for (let j = 1; j < 6; j++) {
          cell = row.cells[j];
          if (this.stats.length >= i) {
            cell.innerHTML = this.get(i - 1, j);
          } else {
            cell.innerHTML = '-';
          }
        }
      }
    }));
  }

  createTopTenOverallSurvival() {
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    const table = (<HTMLTableElement>document.getElementById('stats-table-world-survival'));
    this.restService.getTopTenStatisticsOverall('survival').subscribe((stats => {
      this.stats = stats;
      row = table.rows[0];
      for (let i = 1; i < 11; i++) {
        row = table.rows[i];
        cell = row.cells[0];
        cell.innerHTML = String(i + '.');
        for (let j = 1; j < 6; j++) {
          cell = row.cells[j];
          if (this.stats.length >= i) {
            cell.innerHTML = this.get(i - 1, j);
          } else {
            cell.innerHTML = '-';
          }
        }
      }
    }));
  }
  /*
  createTopTenOverallTableXquiz() {
    let cell: HTMLTableCellElement;
    let header: HTMLTableSectionElement;
    let row: HTMLTableRowElement;
    const table = (<HTMLTableElement>document.getElementById('stats-table-world-xquiz'));
    this.restService.getTopTenStatisticsOverall('xquiz').subscribe((stats => {
      row = (<HTMLTableRowElement>document.getElementById('stats-table-world-xquiz-header'));
      row.bgColor = '#4286f4';
      console.log(stats);
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
          } else {
            cell.innerHTML = '-';
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

  createTopTenOverallSurvival() {
    let cell: HTMLTableCellElement;
    let header: HTMLTableSectionElement;
    let row: HTMLTableRowElement;
    const table = (<HTMLTableElement>document.getElementById('stats-table-world-survival'));
    this.restService.getTopTenStatisticsOverall('survival').subscribe((stats => {
      row = (<HTMLTableRowElement>document.getElementById('stats-table-world-survival-header'));
      row.bgColor = '#4286f4';
      console.log(stats);
      this.stats = stats;
      for (let i = 0; i < 10; i++) {
        header = table.createTHead();
        row = header.insertRow(i + 1);
        cell = row.insertCell(0);
        cell.innerHTML = '<b>' + String(i + 1) + '.</b>';
        for (let j = 1; j < 6; j++) {
          cell = row.insertCell(j);
          cell.width = '100px';
          if (this.stats.length > i) {
            cell.innerHTML = this.get(i, j);
          } else {
            cell.innerHTML = '-';
          }
          if ((i % 2) === 0) {
            row.bgColor = '#f9fafc';
          }else {
            row.bgColor = '#eaf0f9';
          }
        }
      }
    }));
  }
*/
  get(index: number, indexAttribute) {
    if (indexAttribute === 1) {
      if (this.stats[index].anzahlFragen === 0) {
        return String('-');
      }
      return String(this.stats[index].anzahlFragen);
    } else if (indexAttribute === 2) {
      if (this.stats[index].anzahlFragen === 0) {
        return String('-');
      }
      return String(this.stats[index].fragenRichtig);
    } else if (indexAttribute === 3) {
      if (this.stats[index].anzahlFragen === 0) {
        return String('-');
      }
      return String(this.stats[index].punktZahl);
    } else if (indexAttribute === 4) {
      if (this.stats[index].anzahlFragen === 0) {
        return String('-');
      }
      return String(this.stats[index].anzahlFragen);
    } else if (indexAttribute === 5) {
      if (this.stats[index].anzahlFragen === 0) {
        return String('-');
      }
      return String(this.stats[index].userName);
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
  userName: string;
}
