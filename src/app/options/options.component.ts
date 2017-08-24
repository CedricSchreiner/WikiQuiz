import {Component, OnInit } from '@angular/core';
import {RestService} from '../service/rest.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})

export class OptionsComponent implements OnInit {
  status: number;
  avatarLinkString: string;
  text: string;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.avatarLinkString = './assets/' + sessionStorage.getItem('link');
  }

  logout() {
    sessionStorage.clear();
  }
}
