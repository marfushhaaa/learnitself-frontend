import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesComponent } from './courses.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { authConfig } from '../../app.config';
import { provideRouter } from '@angular/router';

describe('CoursesComponent', () => {
  let component: CoursesComponent;
  let fixture: ComponentFixture<CoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OAuthModule.forRoot({ resourceServer: { sendAccessToken: true } }),
        CoursesComponent,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthConfig, useValue: authConfig },
        provideRouter([]),
      ],
      teardown: { destroyAfterEach: true },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty courses on start', () => {
    expect(component.courses()).toEqual([]);
  });

  it('should have empty searchTerm on start', () => {
    expect(component.searchTerm()).toBe('');
  });

  it('should have no category selected on start', () => {
    expect(component.selectedCategoryId()).toBeNull();
  });

  it('should update searchTerm when onSearchChange is called', () => {
    component.onSearchChange('Angular');
    expect(component.searchTerm()).toBe('Angular');
  });

  it('should update selectedCategoryId when onCategoryChange is called', () => {
    component.onCategoryChange('2');
    expect(component.selectedCategoryId()).toBe(2);
  });

  it('should set selectedCategoryId to null when empty string is passed', () => {
    component.onCategoryChange('');
    expect(component.selectedCategoryId()).toBeNull();
  });

  it('should filter courses by search term', () => {
    component.courses.set([
      { id: 1, name: 'Angular Kurs', description: '', courseLength: 5, creation_date: '', creatorId: '', creatorUsername: '', category: { id: 1, name: 'programmierung' } },
      { id: 2, name: 'Gitarre Basics', description: '', courseLength: 3, creation_date: '', creatorId: '', creatorUsername: '', category: { id: 2, name: 'music' } },
    ]);

    component.onSearchChange('Angular');
    expect(component.filteredCourses().length).toBe(1);
    expect(component.filteredCourses()[0].name).toBe('Angular Kurs');
  });

  it('should show all courses when searchTerm is empty', () => {
    component.courses.set([
      { id: 1, name: 'Angular Kurs', description: '', courseLength: 5, creation_date: '', creatorId: '', creatorUsername: '', category: { id: 1, name: 'programmierung' } },
      { id: 2, name: 'Gitarre Basics', description: '', courseLength: 3, creation_date: '', creatorId: '', creatorUsername: '', category: { id: 2, name: 'music' } },
    ]);

    component.onSearchChange('');
    expect(component.filteredCourses().length).toBe(2);
  });
});