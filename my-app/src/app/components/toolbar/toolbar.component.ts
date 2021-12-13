import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  user: any;
  constructor(private router: Router, private tokenService: TokenService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.user = this.tokenService.GetPayload();
  }

  logout(){
    this.tokenService.DeleteToken();
    this.router.navigate(['/']);
  }

  GetUser() {
    this.usersService.GetUserById(this.user._id).subscribe(data => {
      // todo: add notification data
    }, err => {
      if (err.error.token == null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    })
  }

}
