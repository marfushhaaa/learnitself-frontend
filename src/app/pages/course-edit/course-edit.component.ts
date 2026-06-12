import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { coursesListService } from '../../service/coursesList.service';
import { Category } from '../../dataaccess/category';
import { Course } from '../../dataaccess/course';


@Component({
  selector: 'app-course-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './course-edit.component.html',
  styleUrl: './course-edit.component.css'
})
export class CourseEditComponent implements OnInit {
  private courseService = inject(coursesListService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  originalCourse!: Course;
  categories = signal<Category[]>([]);
  isLoading = signal(false);
  error = signal('');
  courseId!: number;

  form: FormGroup = this.fb.group({
    name:         ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    description:  [''],
    category:     ['', Validators.required],
    courseLength: [null, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCategories();
    this.loadCourse();
  }

  loadCategories(): void {
    this.courseService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.error.set('Kategorien konnten nicht geladen werden.')
    });
  }


  loadCourse(): void {
  this.courseService.getById(this.courseId).subscribe({
    next: (course) => {
      this.originalCourse = course; // ← original merken
      this.form.patchValue({
        name:         course.name,
        description:  course.description,
        category:     course.category.id,
        courseLength: course.courseLength
      });
    }
  });
}

submit(): void {
  if (this.form.invalid) return;

  this.isLoading.set(true);
  const cat = this.categories().find(c => c.id === Number(this.form.value.category));

  const updated: Course = {
    ...this.originalCourse,  // ← alle originalen Felder behalten
    name:         this.form.value.name,
    description:  this.form.value.description,
    courseLength: this.form.value.courseLength,
    category:     cat ?? new Category()
  };

  this.courseService.update(updated).subscribe({
    next: () => this.router.navigate(['/courses']),
    error: () => {
      this.error.set('Kurs konnte nicht gespeichert werden.');
      this.isLoading.set(false);
    }
  });
}

  cancel(): void {
    this.router.navigate(['/courses']);
  }
}