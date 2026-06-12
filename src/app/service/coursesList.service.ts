import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Category} from '../dataaccess/category';
import {Course} from '../dataaccess/course';


@Injectable({
  providedIn: 'root'
})
export class coursesListService {
   private http = inject(HttpClient);

   public static readonly backendUrl = 'courses';

   // GET /api/courses/{id}
   public getById(id: number): Observable<Course> {
      return this.http.get<Course>(environment.backendBaseUrl + coursesListService.backendUrl + `/${id}`);
   }

   // GET /api/courses
   public getList(): Observable<Course[]> {
      return this.http.get<Course[]>(environment.backendBaseUrl + coursesListService.backendUrl);
   }

   // POST /api/courses/create
   public create(course: Course): Observable<Course> {
      return this.http.post<Course>(environment.backendBaseUrl + coursesListService.backendUrl, course);
   }

   // PUT /api/courses/{id}
   public update(course: Course): Observable<Course> {
      return this.http.put<Course>(environment.backendBaseUrl + coursesListService.backendUrl + `/${course.id}`, course);
   }

   // DELETE /api/courses/{id}
   public delete(id: number): Observable<HttpResponse<string>> {
      return this.http.delete<string>(environment.backendBaseUrl + coursesListService.backendUrl + `/${id}`, {observe: 'response'});
   }

   // GET /api/categories - list of categories for dropdown
   public getCategories(): Observable<Category[]> {
      return this.http.get<Category[]>(
         environment.backendBaseUrl + 'categories'
      );
   }
}