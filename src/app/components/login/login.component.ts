import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-bg">
      <!-- <img src="https://assets.nflxext.com/ffe/siteui/vlv3/f85718e-bfa3-4f2c-9203-35803bf59384/0d03254b-d74d-4c3e-9669-078b65313264/IN-en-20230213-popsignuptwoweeks-perspective_alpha_website_large.jpg" class="bg-img">
        <div class="overlay"></div> -->

      <div class="login-header">
        <div class="logo">PODFLIX</div>
      </div>

      <div class="login-card">
        <h2>Sign In</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="input-group">
            <input
              type="email"
              placeholder="Email or phone number"
              formControlName="email"
              [class.error]="f['email'].touched && f['email'].invalid"
            />
            <div
              class="error-message"
              *ngIf="f['email'].touched && f['email'].errors?.['required']"
            >
              Email is required.
            </div>
            <div class="error-message" *ngIf="f['email'].touched && f['email'].errors?.['email']">
              Please enter a valid email.
            </div>
          </div>
          <div class="input-group">
            <input
              type="password"
              placeholder="Password"
              formControlName="password"
              [class.error]="f['password'].touched && f['password'].invalid"
            />
            <div
              class="error-message"
              *ngIf="f['password'].touched && f['password'].errors?.['required']"
            >
              Password is required.
            </div>
          </div>
          <button type="submit" class="btn-signin" [disabled]="loginForm.invalid">Sign In</button>
        </form>

        <!-- <div class="login-footer">
          <p>New to Podflix? <a href="/register">Sign up now</a>.</p>
          <p class="small-text">
            This page is protected by Google reCAPTCHA to ensure you're not a bot.
          </p>
        </div> -->
      </div>
    </div>
  `,
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login Data:', this.loginForm.value);
      // TODO: Call AuthService.login
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get f() {
    return this.loginForm.controls;
  }
}
