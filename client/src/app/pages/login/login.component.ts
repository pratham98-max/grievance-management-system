import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // FormsModule is required for [(ngModel)]
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Form properties bound to the HTML via ngModel
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  // Injections using modern Angular context
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        const role = response?.user?.role || response?.role;
        
        // Fixed paths to perfectly align with your app.routes.ts paths
        if (role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'EMPLOYEE') {
          this.router.navigate(['/employee/dashboard']);
        } else {
          this.router.navigate(['/dashboard']); 
        }
        
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Login error:', err);
        this.errorMessage = err.error?.message || 'Invalid email or password. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}