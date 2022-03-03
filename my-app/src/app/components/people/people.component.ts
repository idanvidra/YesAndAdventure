import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import * as _ from 'lodash' ;

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  users = [];
  loggedInUser: any;
  onlineusers = []

  constructor(private usersService: UsersService, private tokenService: TokenService) { }

  ngOnInit(): void {
    // get logged in user object from the token
    this.loggedInUser = this.tokenService.GetPayload();
    this.GetAllUsers();
  }

  // get all users except logged in user
  GetAllUsers() {
    this.usersService.GetAllUsers().subscribe(data => {
      // remove the logged in user from the list
      _.remove(data.result, {nickname: this.loggedInUser.nickname})
      this.users = data.result;
    });
  }

  // GetUser() {
  //   this.usersService.GetUserById(this.loggedInUser._id).subscribe(data => {
  //     console.log(data)
  //   });
  // }

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
