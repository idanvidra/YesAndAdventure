import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MessageService } from 'src/app/services/message.service';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  user: any;

  notifcations = [];
  socket: any;
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
  ) { }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();

    const dropDownElement = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    this.GetUser();
  }

  logout(){
    this.tokenService.DeleteToken();
    this.router.navigate(['/']);
  }

  GoToHome() {
    this.router.navigate(['streams']);
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(data => {
      this.chatList = data.result.chatList;
      console.log(this.chatList)
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
