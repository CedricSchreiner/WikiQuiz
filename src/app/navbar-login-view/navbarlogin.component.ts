import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbarlogin',
  templateUrl: './navbarlogin.component.html',
  styleUrls: ['./navbarlogin.component.css']
})
export class NavbarloginComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  link(linkToGo: string) {
    window.location.href = linkToGo;
  }
}
