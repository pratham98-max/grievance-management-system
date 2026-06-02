import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  backgrounds: string[] = [
    'assets/bg-solar-1.jpg',
    'assets/bg-solar-2.jpg',
    'assets/bg-solar-3.jpg'
  ];
  
  currentIndex = 0;
  private intervalId: any;

  // 1. Inject the tools we need to safely handle timers
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // 2. ONLY run this code if we are in the real browser (ignore the SSR server)
    if (isPlatformBrowser(this.platformId)) {
      
      // 3. Run the timer OUTSIDE of Angular's core engine so it doesn't cause infinite loops
      this.ngZone.runOutsideAngular(() => {
        
        this.intervalId = setInterval(() => {
          
          // 4. Bring the actual image switch BACK into Angular so the screen updates
          this.ngZone.run(() => {
            this.currentIndex = (this.currentIndex + 1) % this.backgrounds.length;
          });
          
        }, 5000);
        
      });
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}