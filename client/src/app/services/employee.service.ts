import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { from, switchMap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getHeaders(): Observable<HttpHeaders> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => [new HttpHeaders().set('Authorization', `Bearer ${token}`)])
    );
  }

  // Fetch only tickets assigned to this logged-in technician
  getAssignedTickets(): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get(`${environment.apiUrl}/tickets/employee/assigned`, { headers }))
    );
  }

  // Employees reuse the same update route as admins to change the ticket status
  updateTicketStatus(ticketId: string, status: string): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.put(`${environment.apiUrl}/tickets/admin/assign/${ticketId}`, { status }, { headers }))
    );
  }
}