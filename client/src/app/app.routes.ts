import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

// Customer Routes
import { CustomerDashboardComponent } from './pages/customer-dashboard/customer-dashboard.component';
import { LodgeComplaintComponent } from './pages/lodge-complaint/lodge-complaint.component';
import { TicketDetailComponent } from './pages/ticket-detail/ticket-detail.component';

// Admin Routes
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminCategoriesComponent } from './pages/admin-categories/admin-categories.component';

// Employee Routes
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component'; // Import this

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { path: 'dashboard', component: CustomerDashboardComponent },
  { path: 'lodge-complaint', component: LodgeComplaintComponent },
  { path: 'ticket/:id', component: TicketDetailComponent },
  
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/categories', component: AdminCategoriesComponent },
  
  { path: 'employee/dashboard', component: EmployeeDashboardComponent }, // Add this route
  
  { path: '**', redirectTo: '' }
];