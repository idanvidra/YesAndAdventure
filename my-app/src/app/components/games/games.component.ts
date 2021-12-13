import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { GamesService } from 'src/app/services/games.service';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import io from 'socket.io-client';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {
  games = [];
  socketHost: any; // localhost:3000 -> path to node.js application
  socket: any; // emit any event we want

  constructor(private gamesService: GamesService, private tokenService: TokenService, private router: Router,) {
    this.socketHost = 'http://localhost:3000';
    this.socket = io(this.socketHost, {transports: ['websocket']});
  }

  ngOnInit(): void {
    this.AllGames();

    // in the event a new game is added we show the game in the games component
    // 1. client side game-form.component emits refresh event when game is posted
    // 2. server side listens to refresh event and sends refreshPage event to all clients
    // 3. client side listens to refreshPage event and recollects all games from server
    this.socket.on("refreshPage", (data: any) => {
      this.AllGames();
    })
  }

  // get all games created in the site
  // by all players
  AllGames() {
    this.gamesService.getAllGames().subscribe(data => {
      this.games = data.games;
    }, err => { // if token is expired -> logout user
      // this is here only temporarily
      // TODO: move to a place that makes more sense - like toolbar
      if (err.error.token == null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    })
  }

  // time formater for posting the games
  // example: a week from now
  TimeFromNow(time: any) {
    return moment(time).fromNow()
  }
}
