import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';

const BASESOCKET = environment.socket;

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit {

  reciever!: string;
  user: any;
  message!: String; // we added an ngModel in the html (textArea) so we can get the string here
  recieverData: any;
  messagesArray = [];
  socketHost: any; // localhost:3000 -> path to node.js application
  socket: any; // emit any event we want
  yOffset = 10;
  typingMessage: any;
  typing = false;

  constructor(
    private tokenService: TokenService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {
    this.socketHost = BASESOCKET;
    this.socket = io(this.socketHost, {transports: ['websocket']});
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    
    console.log("user")
    console.log(this.user);

    this.route.params.subscribe(params => {
      this.reciever = params.nickname;
      this.GetUserByNickname(this.reciever);

      // listens to emitions of refreshPage and runs GetUserByNickname
      // this will run GetMessages
      this.socket.on('refreshPage', () => {
        this.GetUserByNickname(this.reciever);
      })
    })

    // check the emition of is typing event - when the other user is typing
    this.socket.on('is_typing', (data: any) => {
      if (data.sender == this.reciever) {
        this.typing = true;
      }
    });

    // check the emition of has_stopped_typing event - when the other user stopped typing
    this.socket.on('has_stopped_typing', (data: any) => {
      if (data.sender == this.reciever) {
        this.typing = false;
      }
    })
  }

  // when the view is initialized we will emit 'join chat'
  ngAfterViewInit(): void {
    const params = {
      room1: this.user.nickname,
      room2: this.reciever
    };

    this.socket.emit('join chat', params);
  }

  GetUserByNickname(name:any) {
    this.usersService.GetUserByNickname(name).subscribe(data => {
      this.recieverData = data.result;

      console.log("recieverData")
      console.log(this.recieverData)
      
      // we call the GetMessages function here out of convenience 
      this.GetMessages(this.user._id, data.result._id)
    })
  }

  GetMessages(senderId:any, recieverId:any) {
    this.messageService.GetAllMessages(senderId, recieverId).subscribe(data => {

      console.log("data from Get Messages")
      console.log(data)

      this.messagesArray = data.messages.message;
    })
  }

  SendMessage() {
    console.log("send message before anything")

    if (this.message) { // no messages if empty

      console.log("message not empty")

      this.messageService
      .SendMessage(this.user._id, this.recieverData._id, this.recieverData.nickname, this.message)
        .subscribe(data => {

          console.log("data from send message")
          console.log(data)

        this.message = "" // make field empty after sending
        this.socket.emit('refresh', {}) // emit refresh event when message is sent
      })
    }
  }

  IsTyping() {
    // typing indicator
    // emit this when a user is typing in chat
    this.socket.emit('start_typing', {
      sender: this.user.nickname,
      reciever: this.reciever
    });

    // stop typing indicator
    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.user.nickname,
        reciever: this.reciever
      })
    }, 1000)
  }


}
