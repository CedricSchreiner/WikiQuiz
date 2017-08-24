import {Component, OnInit } from '@angular/core';
import {RestService} from '../service/rest.service';

@Component({
  selector: 'app-options',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})

export class AvatarComponent implements OnInit {
  status: number;
  changeavatarframe: HTMLDivElement;
  changebuttondiv: HTMLDivElement;
  avatarLink: string;
  avatarLinkString: string;
  text: string;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.avatarLinkString = './assets/' + sessionStorage.getItem('link');
  }

  sendChangeAvatar(avatarLink: string) {
    this.restService.changeAvatar(avatarLink).subscribe((post) => {
      sessionStorage.setItem('link', avatarLink);
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
  }

  logout() {
    sessionStorage.clear();
  }
}
