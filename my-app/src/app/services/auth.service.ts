import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const BASEURL = environment.apiHost;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  // recives body (that contains the nickname) and returns 
  // the relevant url for registration
  registerUser(body: any): Observable<any> {
    return this.http.post(`${BASEURL}/register`, body);
  }

  // recives body (that contains the nickname) and returns 
  // the relevant url for loging in
  loginUser(body: any): Observable<any> {
    return this.http.post(`${BASEURL}/login`, body);
  }

}

