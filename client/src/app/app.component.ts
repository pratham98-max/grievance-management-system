import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet]
})
export class App implements OnInit {
  private router = inject(Router);

  ngOnInit() {
    // This will print the exact reason for the routing failure into your browser console!
    this.router.events.subscribe(event => {
      if (event instanceof NavigationCancel) {
        console.error('❌ NAVIGATION CANCELLED:', event.reason);
      }
      if (event instanceof NavigationError) {
        console.error('❌ NAVIGATION ERROR:', event.error);
      }
    });
  }
}