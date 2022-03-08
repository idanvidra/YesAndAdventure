import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
// import { HelperService } from 'src/app/services/helper.service';

const BASESOCKET = environment.socket;

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit, OnChanges {
  // output decorator used to send from child to parent component
  // input decorator used to send from parent to child component
  // send from message to chat component
  // will allow to get data from parent component and use it inside this component
  // to show if user is online
  @Input() users: any;

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
  isOnline = false;

  constructor(
    private tokenService: TokenService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private usersService: UsersService,

    // private helperService: HelperService
  ) {
    this.socketHost = BASESOCKET;
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

    // get the input property from chat component to check which users are online


    // check the emition of is typing event - when the partner is typing
    this.socket.on('is_typing', (data: any) => {
      if (data.sender == this.reciever) {
        this.typing = true;
      }
    });

    // check the emition of has_stopped_typing event - when the partner stopped typing
    this.socket.on('has_stopped_typing', (data: any) => {
      if (data.sender == this.reciever) {
        this.typing = false;
      }
    })
  }

  // detect changes that are made in the component
  // returens the values
  ngOnChanges(changes: SimpleChanges): void {
    const title = document.querySelector('.nameCol');
    if (changes.users.currentValue.length > 0) {
      // check if the player we are talking to is online
      const result = _.indexOf(changes.users.currentValue, this.reciever);
      if (result > -1) {
        this.isOnline = true;
        (title as HTMLElement).style.marginTop = '10px';
      } else {
        this.isOnline = false;
        (title as HTMLElement).style.marginTop = '20px';
      }
    }
  }

  // when the view is initialized we will emit 'join chat'
  ngAfterViewInit(): void {
    const params = {
      room1: this.user.nickname,
      room2: this.reciever
    };

    this.socket.emit('join chat', params);

    // remove user from ready_to_play queue
    this.socket.emit('already_playing')
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
    
    // reset the timer when typing
    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.user.nickname,
        reciever: this.reciever
      })
    }, 500)
  }

  

}

