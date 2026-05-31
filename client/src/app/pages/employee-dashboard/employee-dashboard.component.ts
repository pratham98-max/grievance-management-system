import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  tickets: any[] = [];
  isLoading = true;
  errorMessage = '';

  private employeeService = inject(EmployeeService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadMyTasks();
    }
  }

  loadMyTasks() {
    this.employeeService.getAssignedTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load assigned tasks.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateStatus(ticket: any, newStatus: string) {
    this.employeeService.updateTicketStatus(ticket.ticketId, newStatus).subscribe({
      next: () => {
        ticket.status = newStatus; // Update local UI instantly
        this.cdr.detectChanges();
      },
      error: (err) => alert('Failed to update status')
    });
  }
}