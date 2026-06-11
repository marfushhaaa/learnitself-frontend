import { Routes } from '@angular/router';
import {NoAccessComponent} from './pages/no-access/no-access.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {CoursesComponent} from './pages/courses/courses.component';
import { CourseCreateComponent } from './pages/course-create/course-create.component';


export const routes: Routes = [
   {path: '', component: DashboardComponent},
   {path: 'noaccess', component: NoAccessComponent},
   {path: 'courses', component: CoursesComponent},
   {path: 'courses/create', component: CourseCreateComponent},
];
