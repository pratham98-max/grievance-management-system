import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CustomerDashboardComponent } from './pages/customer-dashboard/customer-dashboard.component';
import { LodgeComplaintComponent } from './pages/lodge-complaint/lodge-complaint.component';
import { TicketDetailComponent } from './pages/ticket-detail/ticket-detail.component'; // Import this

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: CustomerDashboardComponent },
  { path: 'lodge-complaint', component: LodgeComplaintComponent },
  { path: 'ticket/:id', component: TicketDetailComponent }, // Add this dynamic route
  { path: '**', redirectTo: '' }
];