import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-lodge-complaint',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lodge-complaint.component.html',
  styleUrls: ['./lodge-complaint.component.css']
})
export class LodgeComplaintComponent {
  // All properties required by your HTML
  category = '';
  systemStatus = '';
  priority = 'Medium';
  subject = '';
  description = '';
  preferredContact = 'Email';
  selectedFiles: File[] = [];
  
  isSubmitting = false;
  errorMessage = '';

  private ticketService = inject(TicketService);
  private router = inject(Router);

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit() {
    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      category: this.category,
      systemStatus: this.systemStatus,
      priority: this.priority,
      subject: this.subject,
      description: this.description,
      preferredContact: this.preferredContact
    };

    this.ticketService.createTicket(payload).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.router.navigate(['/ticket', response.ticketId]);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Submission failed. Please try again.';
        console.error('Submission failed', err);
      }
    });
  }
}