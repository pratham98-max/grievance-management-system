import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  tickets: any[] = [];
  isLoading = true;
  errorMessage = '';

  // Synchronized Metric Counters
  inProgressCount = 0;
  resolvedCount = 0;

  private employeeService = inject(EmployeeService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchMyWorkload();
    }
  }

  fetchMyWorkload() {
    // FIXED: Correct service method name 'getAssignedTickets'
    this.employeeService.getAssignedTickets().subscribe({
      next: (data: any) => {
        this.tickets = data;
        this.calculateMetrics();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Workload load error:', err);
        this.errorMessage = 'Failed to retrieve your operational assignments.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateMetrics() {
    this.inProgressCount = this.tickets.filter(t => 
      t.status === 'IN_PROGRESS' || t.status === 'Open' || t.status === 'PENDING'
    ).length;
    
    this.resolvedCount = this.tickets.filter(t => 
      t.status === 'RESOLVED' || t.status === 'CLOSED'
    ).length;
  }

  // FIXED: Renamed to match the template event binding 'updateTicketStatus'
  updateTicketStatus(ticket: any, event: any) {
    const nextStatus = event.target.value;
    
    this.employeeService.updateTicketStatus(ticket.ticketId, nextStatus).subscribe({
      next: (res: any) => {
        console.log('Status synced successfully!', res);
        ticket.status = nextStatus; 
        this.calculateMetrics();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Failed to sync state modification:', err);
        alert('Could not update task status.');
      }
    });
  }
}