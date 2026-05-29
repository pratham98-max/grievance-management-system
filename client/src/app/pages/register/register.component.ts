import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Required for two-way binding
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; // <-- Required for *ngIf

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);

  onRegister() {
    this.errorMessage = '';
    
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    this.isLoading = true;
    
    // Call our service to create the user in Firebase AND MongoDB
    this.authService.register(this.email, this.password, this.name).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('User synced successfully:', res);
        this.router.navigate(['/dashboard']); // Route to dashboard on success!
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.errorMessage = err.message || 'Registration failed. Please try again.';
      }
    });
  }
}