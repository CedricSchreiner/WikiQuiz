import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbarmenu',
  templateUrl: './navbarmenu.component.html',
  styleUrls: ['./navbarmenu.component.css']
})
export class NavbarmenuComponent implements OnInit {
  status: number;
  avatarLinkString: string;
  text: string;

  constructor() {
  }

  ngOnInit() {
    this.avatarLinkString = './assets/' + sessionStorage.getItem('link');
  }

  link(linkToGo: string) {
    window.location.href = linkToGo;
  }

  logout() {
    sessionStorage.clear();
  }
}
