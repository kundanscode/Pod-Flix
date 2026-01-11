import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-bg">
        <img src="https://assets.nflxext.com/ffe/siteui/vlv3/f85718e-bfa3-4f2c-9203-35803bf59384/0d03254b-d74d-4c3e-9669-078b65313264/IN-en-20230213-popsignuptwoweeks-perspective_alpha_website_large.jpg" class="bg-img">
        <div class="overlay"></div>
        
        <div class="login-header">
            <img src="assets/podflix-logo.png" alt="PODFLIX" class="logo">
        </div>

        <div class="login-card">
            <h2>Sign In</h2>
            <form>
                <div class="input-group">
                    <input type="email" placeholder="Email or phone number" required>
                </div>
                <div class="input-group">
                    <input type="password" placeholder="Password" required>
                </div>
                <button type="submit" class="btn-signin">Sign In</button>
                
                <div class="form-help">
                    <div class="remember-me">
                        <input type="checkbox" id="remember">
                        <label for="remember">Remember me</label>
                    </div>
                    <a href="#">Need help?</a>
                </div>
            </form>
            
            <div class="login-footer">
                <p>New to Podflix? <a href="/register">Sign up now</a>.</p>
                <p class="small-text">This page is protected by Google reCAPTCHA to ensure you're not a bot.</p>
            </div>
        </div>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {}
