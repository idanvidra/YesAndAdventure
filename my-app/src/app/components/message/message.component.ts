import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  reciever!: string;
  user: any;
  message!: String; // we added an ngModel in the html (textArea) so we can get the string here
  recieverData: any;
  messagesArray = [];
  socketHost: any; // localhost:3000 -> path to node.js application
  socket: any; // emit any event we want
  yOffset = 10

  constructor(
    private tokenService: TokenService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {
    this.socketHost = 'http://localhost:3000';
    this.socket = io(this.socketHost, {transports: ['websocket']});
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.route.params.subscribe(params => {
      this.reciever = params.nickname;
      this.GetUserByNickname(this.reciever);

      // listens to emitions of refreshPage and runs GetUserByNickname
      // this will run GetMessages
      this.socket.on('refreshPage', () => {
        this.GetUserByNickname(this.reciever);
      })
    })
  }

  GetUserByNickname(name:any) {
    this.usersService.GetUserByNickname(name).subscribe(data => {
      this.recieverData = data.result;
      
      // we call the GetMessages function here out of convenience 
      this.GetMessages(this.user._id, data.result._id)
    })
  }

  GetMessages(senderId:any, recieverId:any) {
    this.messageService.GetAllMessages(senderId, recieverId).subscribe(data => {
      this.messagesArray = data.messages.message;
    })
  }

  SendMessage() {
    if (this.message) { // no messages if empty
      this.messageService
      .SendMessage(this.user._id, this.recieverData._id, this.recieverData.nickname, this.message)
      .subscribe(data => {
        this.socket.emit('refresh', {}) // emit refresh event when message is sent
        this.message = "" // make field empty after sending
      })
    }
  }
}
