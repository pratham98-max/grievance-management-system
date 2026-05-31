import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Required for our dropdowns
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  tickets: any[] = [];
  employees: any[] = [];
  isLoading = true;
  errorMessage = '';

  // Quick Stats
  totalTickets = 0;
  unassignedTickets = 0;

  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    }
  }

  loadDashboardData() {
    // 1. Fetch Employees
    this.adminService.getEmployees().subscribe({
      next: (empData) => {
        this.employees = empData;
        
        // 2. Fetch Master Ticket Pool
        this.adminService.getAllTickets().subscribe({
          next: (ticketData) => {
            this.tickets = ticketData;
            this.calculateStats();
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error fetching tickets', err);
            this.errorMessage = 'Failed to load master ticket pool.';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => console.error('Error fetching employees', err)
    });
  }

  calculateStats() {
    this.totalTickets = this.tickets.length;
    this.unassignedTickets = this.tickets.filter(t => !t.assignedTo).length;
  }

  // Handle dropdown changes instantly!
  onUpdateTicket(ticket: any, field: string, event: any) {
    const newValue = event.target.value;
    const updatePayload: any = {};
    updatePayload[field] = newValue; // Dynamically set 'assignedTo' or 'status'

    this.adminService.updateTicket(ticket.ticketId, updatePayload).subscribe({
      next: (res) => {
        console.log('Ticket updated!', res);
        // Update local state without full refresh
        if (field === 'employeeId') ticket.assignedTo = { _id: newValue };
        if (field === 'status') ticket.status = newValue;
        
        this.calculateStats();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to update ticket', err);
        alert('Failed to update ticket. Check console.');
      }
    });
  }
}