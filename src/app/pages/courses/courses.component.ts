import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { AppAuthService } from '../../service/app.auth.service';
import { filter } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { coursesListService } from '../../service/coursesList.service';
import { Course } from '../../dataaccess/course';
import { Category } from '../../dataaccess/category';

@Component({
  selector: 'app-courses',
  imports: [NgClass],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent implements OnInit {
  private authService = inject(AppAuthService);
  private courseService = inject(coursesListService);
  private router = inject(Router);

  oauthService = inject(OAuthService);
  useralias = signal('');

  courses = signal<Course[]>([]);
  filteredCourses = signal<Course[]>([]);
  categories = signal<Category[]>([]);

  searchTerm = signal('');
  selectedCategoryId = signal<number | null>(null);
  isLoading = signal(true);
  enrollingId = signal<number | null>(null);

  ngOnInit(): void {
  if (this.oauthService.hasValidAccessToken()) {
    this.authService.useraliasObservable.subscribe(alias => {
      this.useralias.set(alias);
    });
    this.loadCourses();
  }

  // nach frischem Login User überprüfen
  this.oauthService.events
    .pipe(filter(e => e.type === 'token_received'))
    .subscribe(() => {
      this.authService.useraliasObservable.subscribe(alias => {
        this.useralias.set(alias);
      });
      this.loadCourses();
    });
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.courseService.getList().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.extractCategories(courses);
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }


  /**
   * Extracts categories from course
   * @param courses list of courses
   */
  private extractCategories(courses: Course[]): void {
    const seen = new Set<number>();
    this.categories.set(
      courses
        .map(c => c.category)
        .filter(cat => {
          if (seen.has(cat.id)) return false;
          seen.add(cat.id);
          return true;
        })
    );
  }


  /**
   * Applys filter and filters
   */
  applyFilters(): void {
    this.filteredCourses.set(
      this.courses().filter(course => {
        const matchesSearch = course.name
          .toLowerCase()
          .includes(this.searchTerm().toLowerCase());
        const matchesCategory =
          this.selectedCategoryId() === null ||
          course.category.id === this.selectedCategoryId();
        return matchesSearch && matchesCategory;
      })
    );
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.applyFilters();
  }


  /**
   * User chooses a category from menu dropdown
   * @param categoryId id of the category
   */
  onCategoryChange(categoryId: string): void {
    this.selectedCategoryId.set(categoryId ? Number(categoryId) : null);
    this.applyFilters();
  }

  openCourse(course: Course): void {
    this.router.navigate(['/courses', course.id]);
  }

  createCourse(): void {
    this.router.navigate(['/courses/create']);
  }
}