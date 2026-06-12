import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { coursesListService } from '../../service/coursesList.service';
import { Course } from '../../dataaccess/course';

@Component({
  selector: 'app-course-details.component',
  imports: [],
  templateUrl: './course-details.component.html',
  styleUrl: './course-details.component.css',
})
export class CourseDetailsComponent implements OnInit {
  private courseService = inject(coursesListService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  course = signal<Course | null>(null);
  isLoading = signal(true);
  error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.courseService.getById(id).subscribe({
      next: (course) => {
        this.course.set(course);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Kurs konnte nicht geladen werden.');
        this.isLoading.set(false);
      }
    });
  }

  back(): void {
    this.router.navigate(['/courses']);
  }

  formatDate(date: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
