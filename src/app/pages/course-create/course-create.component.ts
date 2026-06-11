import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { coursesListService } from '../../service/coursesList.service';
import { Course } from '../../dataaccess/course';
import { Category } from '../../dataaccess/category';

@Component({
  selector: 'app-course-create',
  imports: [ReactiveFormsModule],
  templateUrl: './course-create.component.html',
  styleUrl: './course-create.component.css',
})
export class CourseCreateComponent implements OnInit {
  private courseService = inject(coursesListService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  isLoading = signal(false);
  error = signal('');

  form = new FormGroup({
    name:          new FormControl('', [Validators.required, Validators.maxLength(40)]),
    description:   new FormControl(''),
    category:      new FormControl('', [Validators.required]),
    courseLength:  new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    creation_date: new FormControl(new Date().toISOString().split('T')[0])
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.courseService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.error.set('Kategorien konnten nicht geladen werden.')
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const cat = this.categories().find(
      c => c.id === Number(this.form.value.category)
    );

    const courseData: Course = {
      ...new Course(),
      name:          this.form.value.name!,
      description:   this.form.value.description ?? '',
      category:      cat!,
      courseLength:  Number(this.form.value.courseLength),
      creation_date: this.form.value.creation_date!
    };

    this.isLoading.set(true);
    this.courseService.create(courseData).subscribe({
      next: () => this.router.navigate(['/courses']),
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