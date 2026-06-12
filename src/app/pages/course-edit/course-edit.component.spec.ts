import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEditComponent } from './course-edit.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { authConfig } from '../../app.config';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

describe('CourseEditComponent', () => {
  let component: CourseEditComponent;
  let fixture: ComponentFixture<CourseEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OAuthModule.forRoot({ resourceServer: { sendAccessToken: true } }),
        CourseEditComponent,
        ReactiveFormsModule,
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
    fixture = TestBed.createComponent(CourseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have valid form when all required fields are filled', () => {
    component.form.patchValue({
      name: 'Test Kurs',
      category: '1',
      courseLength: 10,
    });
    expect(component.form.valid).toBeTruthy();
  });

  it('should be invalid when name is shorter than 3 characters', () => {
    component.form.patchValue({ name: 'ab' });
    expect(component.form.get('name')?.hasError('minlength')).toBeTruthy();
  });

  it('should be invalid when name is longer than 40 characters', () => {
    component.form.patchValue({ name: 'a'.repeat(41) });
    expect(component.form.get('name')?.hasError('maxlength')).toBeTruthy();
  });

  it('should be invalid when courseLength is less than 1', () => {
    component.form.patchValue({ courseLength: 0 });
    expect(component.form.get('courseLength')?.hasError('min')).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    component.submit();
    expect(component.isLoading()).toBe(false);
  });
});