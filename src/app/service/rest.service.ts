import {Injectable} from '@angular/core';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RestService {

  constructor(private http: Http) {
  }

  login(email: string, password: string) {
    const myHeader = new Headers();
    myHeader.append('Authorization', 'Basic ' + btoa(email + ':' + password));
    return this.http.get('http://localhost:8080/quiz/webapi/auth/login', {headers: myHeader}).map(res => res.json());
  }

  signup(name: string, e_mail: string, passwort: string) {
    const myHeader = new Headers();
    myHeader.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/quiz/webapi/profile',
      JSON.stringify({name: name, e_mail: e_mail, passwort: passwort}), {headers: myHeader})
      .map(res => res.json());
  }

  getQuestions(anzahlFragen: number, quiztype: number) {
    const myHeader = new Headers();
    myHeader.append('Authorization', 'Basic ' + btoa(sessionStorage.getItem('email') +
      ':' + sessionStorage.getItem('password')));
    return this.http.get('http://localhost:8080/quiz/webapi/fragenresource/' + anzahlFragen + '?query=' + quiztype,
                         {headers: myHeader}).map(res => res.json());
  }

  getTopTenStatisticsOverall() {
    console.log('test');
    const myHeader = new Headers();
    myHeader.append('Authorization', 'Basic ' + btoa(sessionStorage.getItem('email') +
      ':' + sessionStorage.getItem('password')));
    return this.http.get('http://localhost:8080/quiz/webapi/stats/topTenOverall', {headers: myHeader})
                         .map (res => res.json());
  }

  getTopTenStatisticsPlayer() {
    const myHeader = new Headers();
    myHeader.append('Authorization', 'Basic ' + btoa(sessionStorage.getItem('email') +
      ':' + sessionStorage.getItem('password')));
    return this.http.get('http://localhost:8080/quiz/webapi/stats/auth/TopTenPlayer', {headers: myHeader})
      .map(res => res.json());
  }

  changePassword(password: string) {
    const myHeader = new Headers();
    myHeader.append('Authorization', 'Basic ' + btoa(sessionStorage.getItem('email') +
      ':' + sessionStorage.getItem('password')));
    myHeader.append('Content-Type', 'application/json');
    console.log(sessionStorage.getItem('username'));
    console.log(sessionStorage.getItem('email'));
    console.log(password);
    return this.http.post('http://localhost:8080/quiz/webapi/auth/profile/chPas',
      JSON.stringify({name: sessionStorage.getItem('username'), e_mail: sessionStorage.getItem('email'), passwort: password}),
      {headers: myHeader})
                        .map(res => res.json());
  }

  changeAvatar(avatarLink: string) {
    const myHeader = new Headers();
    myHeader.append('Authorization', 'Basic ' + btoa(sessionStorage.getItem('email') +
      ':' + sessionStorage.getItem('password')));
    myHeader.append('Content-Type', 'application/json');

    return this.http.post('http://localhost:8080/quiz/webapi/auth/profile/changeAvatar',
        JSON.stringify({e_mail: sessionStorage.getItem('email'), avatar_link: avatarLink}),
        {headers: myHeader})
        .map(res => res.json());
  }
}
