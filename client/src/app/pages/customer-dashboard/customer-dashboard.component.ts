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
  // Renamed these two to match the HTML exactly!
  pendingCount = 0; 
  resolvedCount = 0;

  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID); 

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Clean, synchronous execution context preserved
      this.fetchMyTickets();
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
    // Updated these variables to match as well
    this.pendingCount = this.tickets.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS' || t.status === 'Open').length;
    this.resolvedCount = this.tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  }
}