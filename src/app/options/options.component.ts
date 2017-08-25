import {Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})

export class OptionsComponent implements OnInit {
  status: number;
  text: string;

  constructor() {
  }

  ngOnInit() {
  }

  link(linkToGo: string) {
    window.location.href = linkToGo;
  }
}
