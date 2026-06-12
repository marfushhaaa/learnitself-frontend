import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

import { coursesListService } from './coursesList.service';
import { Course } from '../dataaccess/course';
import { Category } from '../dataaccess/category';
import { environment } from '../../environments/environment';

const mockCategory: Category = { id: 1, name: 'Musik' };

const mockCourse: Course = {
  id: 1,
  name: 'Test Kurs',
  description: 'Beschreibung',
  courseLength: 10,
  creation_date: '2026-06-12',
  creatorId: 'abc-123',
  creatorUsername: 'margo',
  category: mockCategory,
};

describe('coursesListService', () => {
  let service: coursesListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        coursesListService,
      ],
      teardown: { destroyAfterEach: true },
    });

    service = TestBed.inject(coursesListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get all courses', () => {
    service.getList().subscribe(courses => {
      expect(courses.length).toBe(1);
      expect(courses[0].name).toBe('Test Kurs');
    });

    const req = httpMock.expectOne(
      environment.backendBaseUrl + 'courses'
    );
    expect(req.request.method).toBe('GET');
    req.flush([mockCourse]);
  });

  it('should get course by id', () => {
    service.getById(1).subscribe(course => {
      expect(course.id).toBe(1);
      expect(course.name).toBe('Test Kurs');
    });

    const req = httpMock.expectOne(
      environment.backendBaseUrl + 'courses/1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCourse);
  });

  it('should create a course', () => {
    service.create(mockCourse).subscribe(course => {
      expect(course.id).toBe(1);
      expect(course.name).toBe('Test Kurs');
    });

    const req = httpMock.expectOne(
      environment.backendBaseUrl + 'courses'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCourse);
    req.flush(mockCourse);
  });

  it('should update a course', () => {
    service.update(mockCourse).subscribe(course => {
      expect(course.id).toBe(1);
    });

    const req = httpMock.expectOne(
      environment.backendBaseUrl + 'courses/1'
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockCourse);
    req.flush(mockCourse);
  });

  it('should delete a course', () => {
    service.delete(1).subscribe(response => {
      expect(response.status).toBe(200);
    });

    const req = httpMock.expectOne(
      environment.backendBaseUrl + 'courses/1'
    );
    expect(req.request.method).toBe('DELETE');
    req.flush('Course 1 is successfully deleted', { status: 200, statusText: 'OK' });
  });

  it('should get all categories', () => {
    service.getCategories().subscribe(categories => {
      expect(categories.length).toBe(1);
      expect(categories[0].name).toBe('Musik');
    });

    const req = httpMock.expectOne(
      environment.backendBaseUrl + 'categories'
    );
    expect(req.request.method).toBe('GET');
    req.flush([mockCategory]);
  });
});