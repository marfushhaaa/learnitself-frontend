import { AfterViewInit, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import {coursesListService} from '../../service/coursesList.service';
import { Course } from '../../dataaccess/course';


@Component({
  selector: 'app-courses',
  imports: [],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css',
})
export class CoursesComponent implements OnInit {
  private courseService = inject(coursesListService);
  courses = signal<Course[]>([]);

  async ngOnInit() {
    await this.reloadData();
  }

  reloadData() {
    this.courseService.getList().subscribe(obj => {
      this.courses.set(obj);
    });
  }
}
