import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-bg">
        <img src="https://assets.nflxext.com/ffe/siteui/vlv3/f85718e-bfa3-4f2c-9203-35803bf59384/0d03254b-d74d-4c3e-9669-078b65313264/IN-en-20230213-popsignuptwoweeks-perspective_alpha_website_large.jpg" class="bg-img">
        <div class="overlay"></div>
        
        <div class="login-header">
             <img src="assets/podflix-logo.png" alt="PODFLIX" class="logo">
             <a href="/login" class="auth-link">Sign In</a>
        </div>

        <div class="login-card">
            <h2>Sign Up</h2>
            <p>Just a few more steps and you're done!</p>
            <form>
                <div class="input-group">
                    <input type="email" placeholder="Email" required>
                </div>
                 <div class="input-group">
                    <input type="password" placeholder="Add a password" required>
                </div>
                <button type="submit" class="btn-signin">Sign Up</button>
            </form>
        </div>
    </div>
  `,
  styleUrls: ['../login/login.component.css'] // Reuse login styles
})
export class RegisterComponent {}
