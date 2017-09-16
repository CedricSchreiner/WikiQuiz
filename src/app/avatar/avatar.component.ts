import {Component, OnInit } from '@angular/core';
import {RestService} from '../service/rest.service';
import {isUserloggedIn} from '../static-functions/static.function';

@Component({
  selector: 'app-options',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})

export class AvatarComponent implements OnInit {
  status: number;
  avatarLinkString: string;
  text: string;
  isUserLoggesIn: boolean;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.isUserLoggesIn = true;
    if (!isUserloggedIn()) {
      this.isUserLoggesIn = false;
      this.link('');
    }
    this.avatarLinkString = '../../assets/' + sessionStorage.getItem('actual_link');
  }

  selectAvatar(avatarLink: string, linkToGo: string) {
    sessionStorage.setItem('actual_link', avatarLink);
    this.link(linkToGo);
  }

  sendChangeAvatar() {
    this.restService.changeAvatar(sessionStorage.getItem('actual_link')).subscribe((post) => {
      this.text = 'Avatar changed successfully';
      console.log(post);
    }, (err: any) => {
      this.status = err.status;
      if (err.status === 0) {
        this.text = 'no connection to the server';
      } else if (err.status === 200) {
        this.text = 'password changed succesfully';
      } else {
        console.log(err.status);
        this.text = 'Oops, something went wrong';
      }
    });
    sessionStorage.setItem('link', sessionStorage.getItem('actual_link'));
    this.link('options');
  }

  logout() {
    sessionStorage.clear();
  }

  link(linkToGo: string) {
    window.location.href = linkToGo;
  }
}
