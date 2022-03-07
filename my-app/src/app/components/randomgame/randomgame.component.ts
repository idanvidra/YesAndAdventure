import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-randomgame',
  templateUrl: './randomgame.component.html',
  styleUrls: ['./randomgame.component.css']
})
export class RandomgameComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  readyToPlay() {
    console.log("ready to play");
  }

}
