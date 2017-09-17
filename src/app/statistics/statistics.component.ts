import {Component, OnInit, AfterViewInit } from '@angular/core';
import { RestService } from '../service/rest.service';
import { isUserloggedIn } from '../static-functions/static.function';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, AfterViewInit {
  stats: Statistic[];
  avatarLinkString: string;
  userInTopList: boolean;
  isUserLoggesIn: boolean;

  constructor(private restService: RestService) {
  }

  ngAfterViewInit() {
    this.createTopTenPlayerXquiz();
    this.createTopTenOverallTableXquiz();
    this.createTopTenPlayerSurvival();
    this.createTopTenOverallSurvival();
    const personalXquizTab = (<HTMLLinkElement>document.getElementById('personal-xquiz-tab'));
    const personalSurvivalTab = (<HTMLLinkElement>document.getElementById('personal-survival-tab'));
    const worldXquizTab = (<HTMLLinkElement>document.getElementById('world-xquiz-tab'));
    const worldSurvivalTab = (<HTMLLinkElement>document.getElementById('world-survival-tab'));
    personalXquizTab.innerHTML = 'Top 10 Personal XQuiz';
    personalSurvivalTab.innerHTML = 'Top 10 Personal Survival';
    worldXquizTab.innerHTML = 'Top 10 World Wide XQuiz';
    worldSurvivalTab.innerHTML = 'Top 10 World Wide Survival';
    if (window.screen.width < 961) {
      personalXquizTab.innerHTML = 'Pers.<br>XQuiz';
      personalSurvivalTab.innerHTML = 'Pers.<br>Survival';
      worldXquizTab.innerHTML = 'World<br>XQuiz';
      worldSurvivalTab.innerHTML = 'World<br>Survival';
    }
  }

  ngOnInit() {
    this.isUserLoggesIn = true;
    if (!isUserloggedIn()) {
      this.isUserLoggesIn = false;
      this.link('');
    }
    this.avatarLinkString = './assets/' + sessionStorage.getItem('link');
    this.userInTopList = false;

  }

  createTopTenPlayerXquiz() {
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    let table: HTMLTableElement;
    table = (<HTMLTableElement>document.getElementById('a'));
    console.log(table);
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

      console.log(this.stats);
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
    let userInTopList: boolean;
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    const table = (<HTMLTableElement>document.getElementById('stats-table-world-xquiz'));
    const lastRow = (<HTMLTableRowElement>document.getElementById('last-row-xquiz'));
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
      for (let i = 0; i < 10; i++) {
        row = table.rows[i + 1];
        cell = row.cells[5];
        if (sessionStorage.getItem('username') === cell.innerHTML) {
          userInTopList = true;
        }
      }
      if (!userInTopList) {
        lastRow.style.visibility = 'visible';
        this.restService.getStatisticsPlayer('xquiz').subscribe((statsTop => {
          this.stats[0] = statsTop;
          row = table.rows[11];
          for (let i = 0; i < 5; i++) {
            cell = row.cells[i + 1];
            if (this.stats !== undefined) {
              cell.innerHTML = this.get(0, i + 1);
            } else {
              cell.innerHTML = '-';
            }
          }
          cell = row.cells[0];
          cell.innerHTML = 'Your rank';
          cell = row.cells[5];
          cell.innerHTML = sessionStorage.getItem('username');
        }));
      }
    }));
  }

  createTopTenOverallSurvival() {
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    const table = (<HTMLTableElement>document.getElementById('stats-table-world-survival'));
    const lastRow = (<HTMLTableRowElement>document.getElementById('last-row-survival'));
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
      for (let i = 1; i < 11; i++) {
        row = table.rows[i];
        cell = row.cells[5];
        if (sessionStorage.getItem('username') === cell.innerHTML) {
          this.userInTopList = true;
        }
      }
      if (!this.userInTopList) {
        ///lastRow.style.visibility = 'visible';
        this.restService.getStatisticsPlayer('survival').subscribe((statsTop => {
          this.stats[0] = statsTop;
          row = table.rows[11];
          for (let i = 0; i < 5; i++) {
            cell = row.cells[i + 1];
            if (this.stats !== undefined) {
              cell.innerHTML = this.get(0, i + 1);
            } else {
              cell.innerHTML = '-';
            }
          }
          cell = row.cells[0];
          cell.innerHTML = 'Your rank';
          cell = row.cells[5];
          cell.innerHTML = sessionStorage.getItem('username');
        }));
      }
    }));
  }

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
      return String(this.stats[index].anzahlSpiele);
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
