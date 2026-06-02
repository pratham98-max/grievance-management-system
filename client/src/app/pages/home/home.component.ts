import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, NgZone, ChangeDetectorRef } from '@angular/core';
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
  // Using the exact paths from your project structure
  backgrounds: string[] = [
    '/assets/bg-solar-1.jpg',
    '/assets/bg-solar-2.jpg',
    '/assets/bg-solar-3.jpg'
  ];
  
  currentIndex = 0;
  private intervalId: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef // <-- 1. Inject Change Detector
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        
        this.intervalId = setInterval(() => {
          this.ngZone.run(() => {
            // Change the image index
            this.currentIndex = (this.currentIndex + 1) % this.backgrounds.length;
            
            // 2. FORCE Angular to repaint the HTML immediately
            this.cdr.detectChanges(); 
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