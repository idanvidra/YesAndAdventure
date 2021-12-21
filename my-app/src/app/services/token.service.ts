import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class TokenService {

  constructor(private cookieService: CookieService) { }

  SetToken(token: string) {
    this.cookieService.set('chat_token', token);
  }

  GetToken() {
    return this.cookieService.get('chat_token');
  }

  DeleteToken() {
    this.cookieService.delete('chat_token');
  }

  // get only the payload part of the token
  GetPayload() {
    const token = this.GetToken();
    let payload;
    if (token) {
      // the token is made up of Header,Payload,Signature
      // these are seperated by dots '.'
      payload = token.split('.')[1];
      // the payload is in base 64
      // so we need to decode it using atob
      payload = JSON.parse(window.atob(payload));
    }

    return payload.data;
  }
}
