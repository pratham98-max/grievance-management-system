import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { TicketService } from '../../services/ticket.service';
import { CommentService } from '../../services/comment.service'; 

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule], 
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {
  ticket: any = null;
  isLoading = true;
  errorMessage = '';

  // Chat Variables
  comments: any[] = [];
  newCommentText = '';
  isSending = false;

  private route = inject(ActivatedRoute);
  private ticketService = inject(TicketService);
  private commentService = inject(CommentService); 
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const ticketId = this.route.snapshot.paramMap.get('id');
      if (ticketId) {
        // Clean execution context preserved for your HTTP Interceptors
        this.fetchTicketDetails(ticketId);
        this.fetchComments(ticketId); 
      }
    }
  }

  fetchTicketDetails(ticketId: string) {
    this.ticketService.getTicketById(ticketId).subscribe({
      next: (data) => {
        this.ticket = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching ticket:', err);
        this.errorMessage = 'Failed to load ticket details.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchComments(ticketId: string) {
    this.commentService.getComments(ticketId).subscribe({
      next: (data) => {
        this.comments = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load comments', err)
    });
  }

  sendComment() {
    if (!this.newCommentText.trim() || !this.ticket) return;

    this.isSending = true;
    this.commentService.addComment(this.ticket.ticketId, this.newCommentText).subscribe({
      next: (newMsg) => {
        this.comments.push(newMsg);
        this.newCommentText = ''; 
        this.isSending = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to send message', err);
        this.isSending = false;
        this.cdr.detectChanges();
      }
    });
  }
}