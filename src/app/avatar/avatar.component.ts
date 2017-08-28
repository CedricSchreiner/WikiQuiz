import {Component, OnInit } from '@angular/core';
import {RestService} from '../service/rest.service';

@Component({
  selector: 'app-options',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})

export class AvatarComponent implements OnInit {
  status: number;
  avatarLinkString: string;
  text: string;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.avatarLinkString = '../../assets/' + sessionStorage.getItem('actual_link');
  }

  selectAvatar(avatarLink: string, linkToGo: string) {
    sessionStorage.setItem('actual_link', avatarLink);
    this.link(linkToGo);
  }

  sendChangeAvatar() {
    this.restService.changeAvatar(sessionStorage.getItem('link')).subscribe((post) => {
      this.text = 'Avatar successfully changed';
      console.log(post);
    }, (err: any) => {
      this.status = err.status;
      if (err.status === 0) {
        this.text = 'keine Verbindung zum Server';
      } else if (err.status === 201) {
        this.text = 'Passwort erfolgreich geändert';
      } else {
        this.text = 'Ups, da ist etwas schief gelaufen';
      }
    });
    sessionStorage.setItem('link', sessionStorage.getItem('actual_link'));
  }

  logout() {
    sessionStorage.clear();
  }

  link(linkToGo: string) {
    window.location.href = linkToGo;
  }
}
