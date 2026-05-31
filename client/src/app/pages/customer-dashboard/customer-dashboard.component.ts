// 1. Import PLATFORM_ID and isPlatformBrowser
import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser, CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  tickets: any[] = [];
  isLoading = true;
  errorMessage = '';

  totalGrievances = 0;
  pendingResolution = 0;
  resolvedTickets = 0;

  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);
  
  // 2. Inject the Platform ID to detect SSR
  private platformId = inject(PLATFORM_ID); 

  ngOnInit() {
    // 3. ONLY fetch data if we are in the real browser!
    if (isPlatformBrowser(this.platformId)) {
      // Firebase needs a split second to initialize the user state on refresh
      setTimeout(() => {
        this.fetchMyTickets();
      }, 500); 
    }
  }

  fetchMyTickets() {
    this.ticketService.getMyTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.calculateStats();
        this.isLoading = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load your tickets.';
        this.isLoading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  calculateStats() {
    this.totalGrievances = this.tickets.length;
    this.pendingResolution = this.tickets.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;
    this.resolvedTickets = this.tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  }
}