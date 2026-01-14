import { Component, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  email = signal('');

  faqs = signal([
    {
      question: 'What is Podflix?',
      answer:
        'Podflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.',
      isOpen: false,
    },
    {
      question: 'How much does Podflix cost?',
      answer:
        'Watch Podflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹149 to ₹649 a month. No extra costs, no contracts.',
      isOpen: false,
    },
    {
      question: 'Where can I watch?',
      answer:
        'Watch anywhere, anytime. Sign in with your Podflix account to watch instantly on the web at podflix.com from your personal computer or on any internet-connected device that offers the Podflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.',
      isOpen: false,
    },
    {
      question: 'How do I cancel?',
      answer:
        'Podflix is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.',
      isOpen: false,
    },
    {
      question: 'What can I watch on Podflix?',
      answer:
        'Podflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.',
      isOpen: false,
    },
    {
      question: 'Is Podflix good for kids?',
      answer:
        'The Podflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space.',
      isOpen: false,
    },
  ]);

  constructor(private router: Router, private authService: AuthService) {}

  toggleFaq(index: number) {
    this.faqs.update((faqs) => {
      faqs[index].isOpen = !faqs[index].isOpen;
      return [...faqs]; // Return new array reference to trigger change detection
    });
  }

  getStarted() {
    if (this.email()) {
      this.authService.checkEmail(this.email()).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Email check failed:', error);
          // Optional: Navigate to register if check fails or show error
          this.router.navigate(['/register'], { queryParams: { email: this.email() } });
        },
      });
    } else {
      this.router.navigate(['/register']);
    }
  }
}
