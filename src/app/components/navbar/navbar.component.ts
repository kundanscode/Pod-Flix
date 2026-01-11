import { Component, HostListener, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isScrolled = signal(false);
  isHidden = signal(false); // Controls auto-hide on scroll
  isVisible = signal(true); // Controls visibility based on Route (Landing/Login/Register)
  
  isSearchOpen = signal(false);
  searchQuery = signal('');
  isMobileMenuOpen = signal(false);

  lastScrollTop = 0;
  hideTimeout: any;

  constructor(private router: Router) {
    // Listen to route changes to show/hide navbar globally
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const hiddenRoutes = ['/', '/login', '/register'];
      this.isVisible.set(!hiddenRoutes.includes(event.urlAfterRedirects));
      this.isMobileMenuOpen.set(false); // Close mobile menu on nav
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Background transparency logic
    this.isScrolled.set(scrollTop > 50);

    // Auto-hide logic
    if (this.isVisible()) {
        this.showNavbar(); 
        this.lastScrollTop = scrollTop;
    }
  }

  @HostListener('mousemove')
  onMouseMove() {
    if (this.isVisible()) this.showNavbar();
  }

  showNavbar() {
    this.isHidden.set(false);
    clearTimeout(this.hideTimeout);
    
    // Auto-hide after 3 seconds of inactivity
    this.hideTimeout = setTimeout(() => {
        if (this.isScrolled()) { // Only hide if we are scrolled down (Netflix behavior)
             this.isHidden.set(true);
        }
    }, 3000);
  }

  ngOnInit() {
      this.showNavbar();
  }

  toggleSearch() {
      this.isSearchOpen.update(v => !v);
      if (this.isSearchOpen()) {
          setTimeout(() => document.getElementById('searchInput')?.focus(), 100);
      }
  }

  submitSearch() {
      if (this.searchQuery().trim()) {
          // Implement search logic here (e.g., navigate to browse with query)
          console.log('Searching for:', this.searchQuery());
      }
      this.isSearchOpen.set(false);
  }

  toggleMobileMenu() {
      this.isMobileMenuOpen.update(v => !v);
  }

  reload() {
      window.location.reload();
  }
}
