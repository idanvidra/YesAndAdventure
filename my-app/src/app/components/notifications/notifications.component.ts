import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client'
import * as moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  socketHost: any; // localhost:3000 -> path to node.js application
  socket: any; // emit any event we want
  user: any;
  notifications = [];

  constructor(private tokenService: TokenService, private usersService: UsersService) {
    this.socketHost = 'http://localhost:3000';
    this.socket = io(this.socketHost, {transports: ['websocket']});
   }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    })
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(data => {
      this.notifications = data.result.notifications;
    })
  }

  // time formater for posting the games
  // example: a week from now
  TimeFromNow(time: any) {
    return moment(time).fromNow()
  }

  MarkNotification(data: any) {
    console.log(data);
  }

  DeleteNotification(data: any) {
    console.log(data);
  }

}
