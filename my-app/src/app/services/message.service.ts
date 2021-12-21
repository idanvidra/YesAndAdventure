import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const BASEURL = environment.apiHost;

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  // send message from sender to reciever
  SendMessage(senderId:any, receiverId:any, receiverName:any, message:any): Observable<any> {
    return this.http.post(`${BASEURL}/chat-message/${senderId}/${receiverId}`, {
      receiverId,
      receiverName,
      message
    })
  }

  // send message from sender to reciever
  GetAllMessages(senderId:any, receiverId:any): Observable<any> {
    return this.http.get(`${BASEURL}/chat-message/${senderId}/${receiverId}`);
  }
}
