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
  userInTopListSurvival: boolean;
  userInTopListTime: boolean;
  userInTopListXquizTen: boolean;
  userInTopListXquizThirty: boolean;
  userInTopListXquizFifty: boolean;
  isUserLoggesIn: boolean;

  constructor(private restService: RestService) {
  }

  ngAfterViewInit() {
    this.createTopTenPlayerXquizTen();
    this.createTopTenPlayerXquizThirty();
    this.createTopTenPlayerXquizFifty();
    this.createTopTenOverallTime();
    this.createTopTenOverallSurvival();
    this.createTopTenOverallTableXquizTen();
    this.createTopTenOverallTableXquizThirty();
    this.createTopTenOverallTableXquizFifty();
    this.createTopTenPlayerTimeQuiz();
    this.createTopTenPlayerSurvival();
  }

  ngOnInit() {
    this.isUserLoggesIn = true;
    if (!isUserloggedIn()) {
      this.isUserLoggesIn = false;
      this.link('');
    }
    this.avatarLinkString = './assets/' + sessionStorage.getItem('link');
    this.userInTopListXquizTen = false;
    this.userInTopListXquizThirty = false;
    this.userInTopListXquizFifty = false;
    this.userInTopListSurvival = false;
    this.userInTopListTime = false;

  }

  createTopTenPlayerXquizTen() {
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    let table: HTMLTableElement;
    table = (<HTMLTableElement>document.getElementById('stats-table-personal-xquiz-ten'));
    this.restService.getTopTenStatisticsPlayer('xquiz_ten').subscribe((stats => {
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

  createTopTenPlayerXquizThirty() {
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    let table: HTMLTableElement;
    table = (<HTMLTableElement>document.getElementById('stats-table-personal-xquiz-thirty'));
    this.restService.getTopTenStatisticsPlayer('xquiz_thirty').subscribe((stats => {
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

  createTopTenPlayerXquizFifty() {
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    let table: HTMLTableElement;
    table = (<HTMLTableElement>document.getElementById('stats-table-personal-xquiz-fifty'));
    this.restService.getTopTenStatisticsPlayer('xquiz_fifty').subscribe((stats => {
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

  createTopTenPlayerTimeQuiz() {
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    let table: HTMLTableElement;
    table = (<HTMLTableElement>document.getElementById('stats-table-personal-time'));
    this.restService.getTopTenStatisticsPlayer('time').subscribe((stats => {
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

  createTopTenOverallTableXquizTen() {
    let ranking: Rank;
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    let tableFull = true;
    const table = (<HTMLTableElement>document.getElementById('stats-table-world-xquiz-ten'));
    const lastRow = (<HTMLTableRowElement>document.getElementById('last-row-xquiz-ten'));
    lastRow.style.visibility = 'hidden';
    this.restService.getTopTenStatisticsOverall('xquiz_ten').subscribe((stats => {
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
            tableFull = false;
          }
        }
      }
      for (let i = 0; i < 10; i++) {
        row = table.rows[i + 1];
        cell = row.cells[5];
        if (sessionStorage.getItem('username') === cell.innerHTML) {
          this.userInTopListXquizTen = true;
        }
      }
      if (!this.userInTopListXquizTen && tableFull) {
        lastRow.style.visibility = 'visible';
        this.restService.getStatisticsPlayer('xquiz_ten').subscribe((statsTop => {
          this.stats[0] = statsTop;
          row = table.rows[11];
          for (let i = 0; i < 5; i++) {
            cell = row.cells[i + 1];
            if (this.stats !== undefined) {
              cell.innerHTML = this.get(0, i + 1);
              if (cell.innerHTML === '-' && i === 3) {
                row.cells[0].innerHTML = 'Not Played';
              } else if (i === 3) {
                this.restService.getPlayerRank('xquiz_ten').subscribe((rank) => {
                  ranking = rank;
                  row.cells[0].innerHTML = String(ranking.ranking);
                });
              }
            } else {
              cell.innerHTML = '-';
            }
          }
          cell = row.cells[5];
          cell.innerHTML = sessionStorage.getItem('username');
        }));
      }
    }));
  }

  createTopTenOverallTableXquizThirty() {
    let ranking: Rank;
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    let tableFull = true;
    const table = (<HTMLTableElement>document.getElementById('stats-table-world-xquiz-thirty'));
    const lastRow = (<HTMLTableRowElement>document.getElementById('last-row-xquiz-thirty'));
    lastRow.style.visibility = 'hidden';
    this.restService.getTopTenStatisticsOverall('xquiz_thirty').subscribe((stats => {
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
            tableFull = false;
          }
        }
      }
      for (let i = 0; i < 10; i++) {
        row = table.rows[i + 1];
        cell = row.cells[5];
        if (sessionStorage.getItem('username') === cell.innerHTML) {
          this.userInTopListXquizThirty = true;
        }
      }
      if (!this.userInTopListXquizThirty && tableFull) {
        lastRow.style.visibility = 'visible';
        this.restService.getStatisticsPlayer('xquiz_thirty').subscribe((statsTop => {
          this.stats[0] = statsTop;
          row = table.rows[11];
          for (let i = 0; i < 5; i++) {
            cell = row.cells[i + 1];
            if (this.stats !== undefined) {
              cell.innerHTML = this.get(0, i + 1);
              if (cell.innerHTML === '-' && i === 3) {
                row.cells[0].innerHTML = 'Not Played';
              } else if (i === 3) {
                this.restService.getPlayerRank('xquiz_ten').subscribe((rank) => {
                  ranking = rank;
                  row.cells[0].innerHTML = String(ranking.ranking);
                });
              }
            } else {
              cell.innerHTML = '-';
            }
          }
          cell = row.cells[5];
          cell.innerHTML = sessionStorage.getItem('username');
        }));
      }
    }));
  }

  createTopTenOverallTableXquizFifty() {
    let ranking: Rank;
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    let tableFull = true;
    const table = (<HTMLTableElement>document.getElementById('stats-table-world-xquiz-fifty'));
    const lastRow = (<HTMLTableRowElement>document.getElementById('last-row-xquiz-fifty'));
    lastRow.style.visibility = 'hidden';
    this.restService.getTopTenStatisticsOverall('xquiz_fifty').subscribe((stats => {
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
            tableFull = false;
          }
        }
      }
      for (let i = 0; i < 10; i++) {
        row = table.rows[i + 1];
        cell = row.cells[5];
        if (sessionStorage.getItem('username') === cell.innerHTML) {
          this.userInTopListXquizFifty = true;
        }
      }
      if (!this.userInTopListXquizFifty && tableFull) {
        lastRow.style.visibility = 'visible';
        this.restService.getStatisticsPlayer('xquiz_fifty').subscribe((statsTop => {
          this.stats[0] = statsTop;
          row = table.rows[11];
          for (let i = 0; i < 5; i++) {
            cell = row.cells[i + 1];
            if (this.stats !== undefined) {
              cell.innerHTML = this.get(0, i + 1);
              if (cell.innerHTML === '-' && i === 3) {
                row.cells[0].innerHTML = 'Not Played';
              }  else if (i === 3) {
                this.restService.getPlayerRank('xquiz_ten').subscribe((rank) => {
                  ranking = rank;
                  row.cells[0].innerHTML = String(ranking.ranking);
                });
              }
            } else {
              cell.innerHTML = '-';
            }
          }
          cell = row.cells[5];
          cell.innerHTML = sessionStorage.getItem('username');
        }));
      }
    }));
  }

  createTopTenOverallSurvival() {
    let ranking: Rank;
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    const table = (<HTMLTableElement>document.getElementById('stats-table-world-survival'));
    const lastRow = (<HTMLTableRowElement>document.getElementById('last-row-survival'));
    lastRow.style.visibility = 'hidden';
    this.restService.getTopTenStatisticsOverall('survival').subscribe((stats => {
      this.stats = stats;
      console.log(stats);
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
          this.userInTopListSurvival = true;
        }
      }
      if (!this.userInTopListSurvival) {
        lastRow.style.visibility = 'visible';
        this.restService.getStatisticsPlayer('survival').subscribe((statsTop => {
          this.stats[0] = statsTop;
          row = table.rows[11];
          for (let i = 0; i < 5; i++) {
            cell = row.cells[i + 1];
            if (this.stats !== undefined) {
              cell.innerHTML = this.get(0, i + 1);
              if (cell.innerHTML === '-' && i === 3) {
                row.cells[0].innerHTML = 'Not Played';
              } else if (i === 3) {
                this.restService.getPlayerRank('xquiz_ten').subscribe((rank) => {
                  ranking = rank;
                  row.cells[0].innerHTML = String(ranking.ranking);
                });
              }
            } else {
              cell.innerHTML = '-';
            }
          }
          cell = row.cells[5];
          cell.innerHTML = sessionStorage.getItem('username');
        }));
      }
    }));
  }

  createTopTenOverallTime() {
    let row: HTMLTableRowElement;
    let cell: HTMLTableCellElement;
    const table = (<HTMLTableElement>document.getElementById('stats-table-world-time'));
    const lastRow = (<HTMLTableRowElement>document.getElementById('last-row-time'));
    lastRow.style.visibility = 'hidden';
    this.restService.getTopTenStatisticsOverall('time').subscribe((stats => {
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
          this.userInTopListTime = true;
        }
      }
      if (!this.userInTopListTime) {
        lastRow.style.visibility = 'visible';
        this.restService.getStatisticsPlayer('time').subscribe((statsTop => {
          this.stats[0] = statsTop;
          row = table.rows[11];
          for (let i = 0; i < 5; i++) {
            cell = row.cells[i + 1];
            if (this.stats !== undefined) {
              cell.innerHTML = this.get(0, i + 1);
              if (cell.innerHTML === '-' && i === 3) {
                row.cells[0].innerHTML = 'Not Played';
              }
            } else {
              cell.innerHTML = '-';
            }
          }
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

interface Rank {
  ranking: number;
}
