import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private http: HttpClient = inject(HttpClient);
  
  // This automatically tracks if a user is logged in or not
  user$ = user(this.auth);

  constructor() { }

  // 1. Register a new user
  register(email: string, password: string, name: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        // After Firebase creates the user, send their details to our Node.js Backend!
        const uid = userCredential.user.uid;
        return this.http.post(`${environment.apiUrl}/auth/sync`, {
          firebaseUid: uid,
          email: email,
          name: name,
          role: 'CUSTOMER' // Default role for open signups
        });
      })
    );
  }

  // 2. Login an existing user
  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // 3. Logout
  logout() {
    return from(signOut(this.auth));
  }

  // 4. Get the secure token to attach to future backend requests
  async getToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      return await currentUser.getIdToken();
    }
    return null;
  }
}