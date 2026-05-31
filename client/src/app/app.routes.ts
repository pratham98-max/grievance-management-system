import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

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
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';

export const routes: Routes = [
  // --- Public Routes (No guards needed) ---
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // --- Customer Routes ---
  { 
    path: 'dashboard', 
    component: CustomerDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CUSTOMER'] } 
  },
  { 
    path: 'lodge-complaint', 
    component: LodgeComplaintComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CUSTOMER'] }
  },
  
  // --- Admin Routes ---
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'admin/categories', 
    component: AdminCategoriesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  
  // --- Employee Routes ---
  { 
    path: 'employee/dashboard', 
    component: EmployeeDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLOYEE'] }
  },

  // --- Shared Protected Route ---
  // (Both Customers and Employees need to see ticket details, so we only check if they are logged in)
  { 
    path: 'ticket/:id', 
    component: TicketDetailComponent,
    canActivate: [authGuard]
  },
  
  // --- Fallback (Catch-all) ---
  { path: '**', redirectTo: '' }
];