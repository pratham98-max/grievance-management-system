import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { from, switchMap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Helper to attach the Firebase token to requests
  private getHeaders(): Observable<HttpHeaders> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        return [new HttpHeaders().set('Authorization', `Bearer ${token}`)];
      })
    );
  }

  // POST: Create a new ticket
  createTicket(ticketData: any): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.post(`${environment.apiUrl}/tickets`, ticketData, { headers });
      })
    );
  }

  // GET: Fetch tickets for the logged-in user
  getMyTickets(): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => {
        return this.http.get(`${environment.apiUrl}/tickets/my-tickets`, { headers });
      })
    );
  }
}