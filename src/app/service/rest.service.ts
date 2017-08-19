import {Injectable} from '@angular/core';
import {Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RestService {

  constructor(private http: Http) {
    console.log('Post login initialized');
  }

  login(email: string, password: string) {
    const myHeader = new Headers();
    myHeader.append('Authorization', 'Basic ' + btoa(email + ':' + password));
    return this.http.get('http://localhost:8080/quiz/webapi/auth/login', {headers: myHeader}).map(res => res.json());
  }

  signup(name: string, email: string, password: string) {

  }
}
