import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone:false
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToPreemptive() {
    this.router.navigate(['/preemptive']);
  }

  goToNonPreemptive() {
    this.router.navigate(['/nonpreemptive']);
  }
}
