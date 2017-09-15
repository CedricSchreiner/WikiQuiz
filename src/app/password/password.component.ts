import {Component, OnInit } from '@angular/core';
import {RestService} from '../service/rest.service';

@Component({
  selector: 'app-options',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})

export class PasswordComponent implements OnInit {
  password1: string;
  password2: string;
  status: number;
  avatarLinkString: string;
  text: string;
  button1: HTMLInputElement;
  button2: HTMLInputElement;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.avatarLinkString = './assets/' + sessionStorage.getItem('link');
  }

  sendChangePassword() {
    this.button1 = (<HTMLInputElement>document.getElementById('newpasswd1'));
    this.button2 = (<HTMLInputElement>document.getElementById('newpasswd2'));
    this.password1 = (<HTMLInputElement>document.getElementById('newpasswd1')).value;
    this.password2 = (<HTMLInputElement>document.getElementById('newpasswd2')).value;
    const regexPasswordSpecialCharachter = new RegExp('.*[\\W].*');
    const regexPasswordContainsCapital = new RegExp('.*[A-Z]+.*');
    const regexPasswordContainsNumber = new RegExp('.*[0-9].*');
    if (this.password1 === this.password2) {
      if (this.password1.length >= 8 && this.password1.length <= 20 &&
        regexPasswordSpecialCharachter.test(this.password1) &&
        regexPasswordContainsCapital.test(this.password1) &&
        regexPasswordContainsNumber.test(this.password1)) {
        this.restService.changePassword(this.password1).subscribe((post) => {
          this.text = 'Password successfully changed';
          sessionStorage.setItem('password', this.password1);
          console.log(post);
        }, (err: any) => {
          this.status = err.status;
          if (err.status === 0) {
            this.text = 'No Connection to the Server';
          }else {
            this.text = 'Ups, there is something wrong';
          }
        });
      }else {
        this.status = 404;
        this.text = 'Length 8-20, min 1 capital Letter, min 1 count, min 1 special character';
      }
    }else {
      this.status = 404;
      this.text = 'passwords are diffrent';
    }
    /* Lösche Inhalt aus den Passwort Text Feldern */
    this.button1.value = '';
    this.button2.value = '';
  }

  link(linkToGo: string) {
    window.location.href = linkToGo;
  }
}
