import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

 onLogin() {
    this.errorMessage = '';
    this.isLoading = true;

    // 1. Log into Firebase securely
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        
        // 2. Firebase success! Now ask Node.js for their official Role
        this.authService.getUserProfile().subscribe({
          next: (userDb) => {
            this.isLoading = false;
            
            // 3. SMART ROUTING based on the database!
          // SMART ROUTING based on the database!
            if (userDb.role === 'ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } 
            else if (userDb.role === 'EMPLOYEE') {
              this.router.navigate(['/employee/dashboard']); // <-- Fixed!
            } 
            else {
              this.router.navigate(['/dashboard']); // Default Customer
            }
          },
          error: (profileErr) => {
            this.isLoading = false;
            this.errorMessage = 'Failed to load user profile.';
          }
        });

      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    });
  }
}