import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
punkte: string;
verhaeltnis: string;

ngOnInit() {
  this.punkte = '400';
  this.verhaeltnis = '50/100';
  }
}
