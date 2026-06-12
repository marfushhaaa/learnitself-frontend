import { Routes } from '@angular/router';
import { NoAccessComponent } from './pages/no-access/no-access.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseCreateComponent } from './pages/course-create/course-create.component';
import { CourseEditComponent } from './pages/course-edit/course-edit.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';

import {AppRoles} from '../app.roles';
import {appCanActivate} from './guard/app.auth.guard';


export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'noaccess', component: NoAccessComponent },
  {
    path: 'courses', component: CoursesComponent, canActivate: [appCanActivate],
    data: { roles: [AppRoles.Read] },
  },
  {
    path: 'courses/create', component: CourseCreateComponent, canActivate: [appCanActivate],
    data: { roles: [AppRoles.Read] },
  },

  {
    path: 'courses/:id', component: CourseDetailsComponent, canActivate: [appCanActivate],
    data: { roles: [AppRoles.Admin] },
    pathMatch: 'full',
  },
    {
    path: 'courses/edit/:id', component: CourseEditComponent, canActivate: [appCanActivate],
    data: { roles: [AppRoles.Admin] },
    pathMatch: 'full',
  },
];
