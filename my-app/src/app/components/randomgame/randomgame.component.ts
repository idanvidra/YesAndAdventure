import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';

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
      console.log(list)
    })


    // for some reason doesn't fire on this event
    // might be that doesn't listen when firing (since runs on init only)
    // potential matchmaking solution: firing this event with two names attached
    // then client side checks the names and then pop up and move to game
    
    // check the use of rooms - like in typing indicator
    this.socket.on("matchmaking", (twoPlayers: any) => {
      console.log("two players 2")
      console.log(twoPlayers)
    })
  }

  readyToPlay() {
    const params = {
      room: 'global', 
      nickname: this.nickname
    }
    console.log(params);
    this.socket.emit('ready_to_play', params)
  }

  GetUserByNickname(name:any) {
    this.usersService.GetUserByNickname(name).subscribe(data => {
      this.recieverData = data.result;
    })
  }

}
