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
            if(status === 0)
          }
        });
    }
  }
}
