import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { coursesListService } from '../../service/coursesList.service';
import { Course } from '../../dataaccess/course';
import { Category } from '../../dataaccess/category';

@Component({
  selector: 'app-course-create',
  imports: [FormsModule],
  templateUrl: './course-create.component.html',
  styleUrl: './course-create.component.css',
})
export class CourseCreateComponent implements OnInit {
  private courseService = inject(coursesListService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  isLoading = signal(false);
  error = signal('');
  errors = signal<Record<string, string>>({});

  // Formular Data
  course = signal<Course>({...new Course(), creation_date: new Date().toISOString().split('T')[0]});


  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.courseService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.error.set('Kategorien konnten nicht geladen werden.')
    });
  }

  onCategoryChange(categoryId: string): void {
    const cat = this.categories().find(c => c.id === Number(categoryId));
    if (cat) {
      this.course.update(c => ({ ...c, category: cat }));
    }
  }

  onFieldChange(field: keyof Course, value: string): void {
    this.course.update(c => ({
      ...c,
      [field]: field === 'courseLength' ? Number(value) : value
    }));
  }

  submit(): void {
    const e: Record<string, string> = {};

    if (!this.course().name) {
      e['name'] = 'Kursname ist erforderlich.';
    }
    if (!this.course().category.id) {
      e['category'] = 'Bitte eine Kategorie wählen.';
    }
    if (!this.course().courseLength) {
      e['courseLength'] = 'Kurslänge ist erforderlich.';
    }

    this.errors.set(e);
    if (Object.keys(e).length > 0) return;

    this.isLoading.set(true);
    this.courseService.create(this.course()).subscribe({
      next: () => {
        this.router.navigate(['/courses']);
      },
      error: () => {
        this.error.set('Kurs konnte nicht erstellt werden.');
        this.isLoading.set(false);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/courses']);
  }
}
