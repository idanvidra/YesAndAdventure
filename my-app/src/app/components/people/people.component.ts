import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import * as _ from 'lodash' ;
import { forEach } from 'lodash';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  users = [];
  loggedInUser: any;
  onlineusers = []
  onlineUsersList = [];
  reverse = true; // reverse the order shown of the users

  constructor(private usersService: UsersService, private tokenService: TokenService) { }

  ngOnInit(): void {
    // get logged in user object from the token
    this.loggedInUser = this.tokenService.GetPayload();

    // choose showing all known users
    // this.GetAllUsers();

    // OR showing only online users
    this.getAllOnlineUsers()
  }

  reverseUsersList(list: any) {
    return list.reverse();
  }

  // get all users except logged in user
  GetAllUsers() {
    this.usersService.GetAllUsers().subscribe(data => {
      // remove the logged in user from the list
      _.remove(data.result, {nickname: this.loggedInUser.nickname})
      this.users = data.result;
      if (this.reverse) {
        this.users = this.reverseUsersList(this.users)
      }
    });
  }

  // get all online users except logged in user
  getAllOnlineUsers() {
    this.usersService.GetAllUsers().subscribe(data => {
      // remove the logged in user from the list
      _.remove(data.result, {nickname: this.loggedInUser.nickname})
      this.users = data.result;
      this.users.forEach((user) => {
        if (this.CheckIfOnline(user['nickname'])) {
          this.onlineUsersList.push(user)
        };
      });
      this.users = this.onlineUsersList;
      if (this.reverse) {
        this.users = this.reverseUsersList(this.users)
      }
    });
  }

  online(event: any) {
    this.onlineusers = event;
  }

  CheckIfOnline(name: any) {
    const result = _.indexOf(this.onlineusers, name);
    if (result > -1) {
      return true;
    } else {
      return false;
    }
  }
  
}
