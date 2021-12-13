import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  // set as undefined
  // set as undefined
  signupForm!: FormGroup;
  errorMessage!: string;
  showSpinner = false;

  constructor(
    private authService: AuthService, 
    private fb: FormBuilder, 
    private router: Router, 
    private tokenService: TokenService
    ) { }

  ngOnInit(): void {
    this.init()
  }

  init() {
    this.signupForm = this.fb.group({
      nickname: ['', Validators.required]
    })
  }

  signupUser() {
    // show spinner while signin is loading
    this.showSpinner = true;
    // if user signup was successful
    this.authService.registerUser(this.signupForm.value).subscribe(data => {
      // set token
      this.tokenService.SetToken(data.token);
      // clean the screan after successful signup
      this.signupForm.reset();
      // route signed user to the streams route
      // wait for 1.75 seconds before routing the user
      setTimeout(() => {
        this.router.navigate(['streams']);
      }, 1750);
    }, (err) => {
      // stop showing spinner if signup failed
      this.showSpinner = false;
      // if user signup failed
      console.log(err);
      // to display Joi errors
      if (err.error.msg) {
        this.errorMessage = err.error.msg[0].message
      }
      // to display other kinds of errors
      if (err.error.message) {
        this.errorMessage = err.error.message;
      }
    });
  }
}
