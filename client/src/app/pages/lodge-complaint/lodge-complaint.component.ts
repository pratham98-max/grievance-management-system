import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-lodge-complaint',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './lodge-complaint.component.html'
})
export class LodgeComplaintComponent {
  category = '';
  subject = '';
  description = '';
  plantReference = '';
  selectedFiles: File[] = [];
  priority: string = 'Medium';
  systemStatus: string = '';
  preferredContact: string = 'Email';
  
  isSubmitting = false;
  errorMessage = '';

  private ticketService = inject(TicketService);
  private router = inject(Router);

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit() {
    this.errorMessage = '';
    
    if (!this.category || !this.subject || !this.description) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    this.isSubmitting = true;

    // --- Build a Standard multipart/form-data Object ---
    const formData = new FormData();
    formData.append('category', this.category);
    formData.append('subject', this.subject);
    formData.append('description', this.description);
    formData.append('plantReference', this.plantReference);

    // Append each raw file to the FormData payload
    this.selectedFiles.forEach((file) => {
      formData.append('attachments', file, file.name);
    });

    // Send the FormData straight to your Node Backend!
    this.ticketService.createTicket(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to submit ticket to local server.';
        this.isSubmitting = false;
      }
    });
  }
}