import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-lodge-complaint',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './lodge-complaint.component.html',
  styleUrls: ['./lodge-complaint.component.css']
})
export class LodgeComplaintComponent {
  category = '';
  plantReference = '';
  subject = '';
  description = '';
  
  isLoading = false;
  errorMessage = '';

  private ticketService = inject(TicketService);
  private router = inject(Router);

  onSubmit() {
    if (!this.category || !this.subject || !this.description) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const ticketData = {
      category: this.category,
      plantReference: this.plantReference,
      subject: this.subject,
      description: this.description
    };

    this.ticketService.createTicket(ticketData).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('Ticket created:', res);
        this.router.navigate(['/dashboard']); // Go back to dashboard on success
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.errorMessage = 'Failed to submit ticket. Please try again.';
      }
    });
  }
}