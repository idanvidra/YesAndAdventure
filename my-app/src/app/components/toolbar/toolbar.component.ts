import { AfterViewInit, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'src/app/services/message.service';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
// import { EventEmitter } from 'stream';

const BASESOCKET = environment.socket;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  // output decorator - will be used to communicate between parent and child components
  // toolbar -> chat -> message components
  // output decorator used to send from child to parent component
  // input decorator used to send from parent to child component
  @Output() onlineUsers = new EventEmitter();

  user: any;
  notifcations = [];
  socketHost: any; // localhost:3000 -> path to node.js application
  socket: any; // emit any event we want
  count = [];
  chatList = [];
  msgNumber = 0;
  imageId: any;
  imageVersion: any;
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private usersService: UsersService,
    private msgService: MessageService
  ) { 
    this.socketHost = BASESOCKET;
    this.socket = io(this.socketHost, {transports: ['websocket']});
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();

    const dropDownElement = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    this.GetUser();

    // emit user connected event
    this.socket.emit('online', { room: 'global', nickname: this.user.nickname });
  }

  logout(){
    this.tokenService.DeleteToken();
    this.router.navigate(['/']);
  }

  GoToHome() {
    this.router.navigate(['streams']);
  }

  ngAfterViewInit(): void {
    this.socket.on('usersOnline', (data: any) => {
      // transfer data to child components
      // this is a different emit from the socket.io emit
      // this is an event emmiter 
      this.onlineUsers.emit(data);
      })
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(data => {
      this.chatList = data.result.chatList;
    }, err => {
      if (err.error.token == null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    })
  }

  MessageDate(data: any) {
    return moment(data).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }

}
