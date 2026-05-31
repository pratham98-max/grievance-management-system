import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { from, switchMap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getHeaders(): Observable<HttpHeaders> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        return [new HttpHeaders().set('Authorization', `Bearer ${token}`)];
      })
    );
  }

  // 1. Fetch EVERY ticket in the system
  getAllTickets(): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get(`${environment.apiUrl}/tickets/admin/all`, { headers }))
    );
  }

  // 2. Fetch the Employee Directory
  getEmployees(): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get(`${environment.apiUrl}/users/employees`, { headers }))
    );
  }

  // 3. Assign/Update a Ticket
  updateTicket(ticketId: string, updateData: any): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.put(`${environment.apiUrl}/tickets/admin/assign/${ticketId}`, updateData, { headers }))
    );
  }
}