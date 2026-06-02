import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Properties mapped exactly to our HTML bindings
  name = '';
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  onSubmit() {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please complete all required input fields.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password security constraint unfulfilled: Minimum 6 characters required.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // CORRECTED: Passed 4 parameters matching the exact expected order: email, password, name, role
    this.authService.register(this.email, this.password, this.name, 'CUSTOMER').subscribe({
      // Replace the redirect line inside your next block with this:
next: () => {
  this.isLoading = false;
  this.router.navigate(['/customer-dashboard']); // <-- Fixed slash to hyphen!
  this.cdr.detectChanges();
},
      error: (err: any) => {
        console.error('Registration processing error:', err);
        this.errorMessage = err.error?.message || 'Failed to create your profile. This email may already be in use.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}