import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-categories.html',
})
export class AdminCategoriesComponent implements OnInit {
  adminService = inject(AdminService);
  categories: any[] = [];
  newCategory = { name: '', description: '' };

  ngOnInit() { this.fetchCategories(); }

  fetchCategories() {
    this.adminService.getCategories().subscribe(res => this.categories = res);
  }

  saveCategory() {
    this.adminService.addCategory(this.newCategory).subscribe(() => {
      this.newCategory = { name: '', description: '' };
      this.fetchCategories();
    });
  }

  toggleStatus(cat: any) {
    const newStatus = cat.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    this.adminService.toggleCategoryStatus(cat._id, newStatus).subscribe(() => this.fetchCategories());
  }
}