import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import io from 'socket.io-client';
import * as _ from 'lodash';


const BASESOCKET = environment.socket;

@Component({
  selector: 'app-randomgame',
  templateUrl: './randomgame.component.html',
  styleUrls: ['./randomgame.component.css']
})
export class RandomgameComponent implements OnInit {

  socketHost: any; // localhost:3000 -> path to node.js application
  socket: any; // emit any event we want
  nickname!: string;
  user: any;
  recieverData: any;
  yOffset = 10;
  buttonClicked = false;

  constructor(
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private usersService: UsersService,
  ) { 
    this.socketHost = BASESOCKET;
    this.socket = io(this.socketHost, {transports: ['websocket']});
  }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
    this.nickname = this.user.nickname;

    this.socket.on("playersReadyToPlay", (list: any) => {
      // console.log(list)
    })

    // check the use of rooms - like in typing indicator
    this.socket.on("matchmaking", (twoPlayers: any) => {
      // console.log("matchmaking")
      console.log(twoPlayers)
      // check if connected user is searching matched
      if (twoPlayers.includes(this.nickname)) {
        this.buttonClicked = false;
        // filter out the other player
        const otherPlayer = twoPlayers.filter((e: any) => { return e !== this.nickname })
        // different redirects depending on enviroment
        if (environment.production) {
          window.location.href = "https://yes-and-adventure.azurewebsites.net/#/chat/" + otherPlayer;
        } else {
          window.location.href = "http://localhost:4200/#/chat/" + otherPlayer;
        }
      }
    })
  }

  readyToPlay() {
    if (this.buttonClicked === false) {
      this.buttonClicked = true;
      const params = {
        room: 'global',
        nickname: this.nickname
      };
      this.socket.emit('ready_to_play', params);
    }
    else {
      console.log("button clicked already");
    }
  }

  GetUserByNickname(name:any) {
    this.usersService.GetUserByNickname(name).subscribe(data => {
      this.recieverData = data.result;
    })
  }

}
