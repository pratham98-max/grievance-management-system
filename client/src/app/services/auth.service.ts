import { Injectable, inject, NgZone } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private http = inject(HttpClient);
  private ngZone = inject(NgZone); // <-- 1. Inject Angular's Zone Fixer

  register(email: string, password: string, name: string, role: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        const uid = userCredential.user.uid;
        return this.http.post(`${environment.apiUrl}/auth/sync`, {
          firebaseUid: uid,
          email: email,
          name: name,
          role: role
        });
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  // 2. Wrap the token resolution safely inside the Angular Zone
  getToken(): Promise<string | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, async (firebaseUser) => {
        unsubscribe(); // Stop listening immediately

        if (firebaseUser) {
          try {
            const token = await firebaseUser.getIdToken();
            this.ngZone.run(() => resolve(token)); // <-- Bring back to Angular!
          } catch (error) {
            console.error('Failed to get token:', error);
            this.ngZone.run(() => resolve(null));
          }
        } else {
          this.ngZone.run(() => resolve(null)); // <-- Bring back to Angular!
        }
      });
    });
  }

  getUserProfile(): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${environment.apiUrl}/auth/me`, { headers });
      })
    );
  }
}