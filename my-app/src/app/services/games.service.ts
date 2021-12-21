import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const BASEURL = environment.apiHost;

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor(private http: HttpClient) { }

  addGame(body: any): Observable<any> {
    return this.http.post(`${BASEURL}/game/add-game`, body);
  }

  getAllGames(): Observable<any> {
    return this.http.get(`${BASEURL}/games`);
  }
}


