import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const BASEURL = environment.apiHost;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  // return all users from DB using the node.js server function route
  // first method of doing this:
  GetAllUsers(): Observable<any>{
    return this.http.get(`${BASEURL}/users`);
  }
  // second method of doing this:
  // async GetAllUsers() {
  //   return await this.http.get(`${BASEURL}/users`);
  // }

  GetUserById(id: any): Observable<any>{
    return this.http.get(`${BASEURL}/user/${id}`);
  }

  GetUserByNickname(nickname: any): Observable<any>{
    return this.http.get(`${BASEURL}/usernick/${nickname}`);
  }
}
