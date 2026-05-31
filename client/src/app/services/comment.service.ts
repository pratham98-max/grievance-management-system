import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { from, switchMap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getHeaders(): Observable<HttpHeaders> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => [new HttpHeaders().set('Authorization', `Bearer ${token}`)])
    );
  }

  // 1. Fetch all messages for a specific ticket
  getComments(ticketId: string): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get(`${environment.apiUrl}/comments/${ticketId}`, { headers }))
    );
  }

  // 2. Send a new message
  addComment(ticketId: string, text: string): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.post(`${environment.apiUrl}/comments/${ticketId}`, { text }, { headers }))
    );
  }
}