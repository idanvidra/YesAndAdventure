import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GamesService } from 'src/app/services/games.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.css']
})
export class GameFormComponent implements OnInit {

  socketHost: any; // localhost:3000 -> path to node.js application
  socket: any; // emit any event we want
  gameForm!: FormGroup;

  constructor(private fb: FormBuilder, private gameService: GamesService) {
    this.socketHost = 'http://localhost:3000';
    this.socket = io(this.socketHost, {transports: ['websocket']});
  }

  ngOnInit(): void {
    this.init()
  }

  init() {
    this.gameForm = this.fb.group({
      game: ["", Validators.required]
    })

  }

  SubmitGame() {
    this.gameService.addGame(this.gameForm.value).subscribe(data => {
      this.socket.emit('refresh', {}) // emit event named refresh to socket.io to node.js server
      this.gameForm.reset();
    })
  }

}
