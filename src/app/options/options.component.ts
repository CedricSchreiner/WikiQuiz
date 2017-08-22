import {Component, OnInit } from '@angular/core';
import {RestService} from '../service/rest.service';
import { User } from '../user/user.component';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})

export class OptionsComponent implements OnInit {
  password1: string;
  password2: string;
  status: number;
  changepwframe: HTMLDivElement;
  text: string;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
  }

  sendChangePassword() {
    this.password1 = (<HTMLInputElement>document.getElementById('newpasswd1')).value;
    this.password2 = (<HTMLInputElement>document.getElementById('newpasswd2')).value;
    const regexEmail = new RegExp('.+@.+.\\..+');
    const regexPasswordSpecialCharachter = new RegExp('.*[\\W].*');
    const regexPasswordContainsCapital = new RegExp('.*[A-Z]+.*');
    const regexPasswordContainsNumber = new RegExp('.*[0-9].*');
    if (this.password1 === this.password2) {
      if (this.password1.length >= 8 && this.password1.length <= 20 &&
          regexPasswordSpecialCharachter.test(this.password1) &&
          regexPasswordContainsCapital.test(this.password1) &&
          regexPasswordContainsNumber.test(this.password1)) {
          this.restService.changePassword(this.password1).subscribe((post) => {
          console.log(post);
          }, (err: any) => {
            this.status = err.status;
            if (err.status === 0) {
              this.text = 'Keine Verbindung zum Server';
            }else {
              this.text = 'Ups, da ist etwas schief gelaufen';
            }
          });
      }else {
        this.status = 404;
        this.text = 'Länge 8-20, min 1 Großbuchstabe, min 1 Zahl, min 1 Sonderzeichen';
      }
    }else {
      this.status = 404;
      this.text = 'Passwöter nicht gleich';
    }
  }

  changePasswordvisibile() {
    this.changepwframe = (<HTMLDivElement>document.getElementById('change-password-frame'));
    this.changepwframe.style.visibility = 'visible';
  }
}
