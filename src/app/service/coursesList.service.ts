import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Course} from '../dataaccess/course';


@Injectable({
  providedIn: 'root'
})
export class coursesListService {
   private http = inject(HttpClient);

   public static readonly backendUrl = 'courses';

   // GET /api/courses
   public getList(): Observable<Course[]> {
      return this.http.get<Course[]>(environment.backendBaseUrl + coursesListService.backendUrl); // Link: /api/courses/
   }
}