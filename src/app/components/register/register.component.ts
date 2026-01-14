import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-bg">
      <img
        src="https://assets.nflxext.com/ffe/siteui/vlv3/f85718e-bfa3-4f2c-9203-35803bf59384/0d03254b-d74d-4c3e-9669-078b65313264/IN-en-20230213-popsignuptwoweeks-perspective_alpha_website_large.jpg"
        class="bg-img"
      />
      <div class="overlay"></div>

      <div class="login-header">
        <div class="logo">PODFLIX</div>
      </div>

      <div class="login-card">
        <h2>Sign Up</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="input-group">
            <input
              type="text"
              placeholder="Username"
              formControlName="username"
              [class.error]="f['username'].touched && f['username'].invalid"
            />
            <div
              class="error-message"
              *ngIf="f['username'].touched && f['username'].errors?.['required']"
            >
              Username is required.
            </div>
            <div
              class="error-message"
              *ngIf="f['username'].touched && f['username'].errors?.['minlength']"
            >
              Username must be at least 3 characters.
            </div>
          </div>

          <div class="input-group">
            <input
              type="email"
              placeholder="Email"
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
              placeholder="Add a password"
              formControlName="password"
              [class.error]="f['password'].touched && f['password'].invalid"
            />
            <div
              class="error-message"
              *ngIf="f['password'].touched && f['password'].errors?.['required']"
            >
              Password is required.
            </div>
            <div
              class="error-message"
              *ngIf="f['password'].touched && f['password'].errors?.['minlength']"
            >
              Password must be at least 6 characters.
            </div>
          </div>

          <button type="submit" class="btn-signin" [disabled]="registerForm.invalid">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['../login/login.component.css'], // Reuse login styles
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Register Data:', this.registerForm.value);
      // TODO: Call AuthService.register
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  get f() {
    return this.registerForm.controls;
  }
}
