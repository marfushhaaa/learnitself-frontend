import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCreateComponent } from './course-create.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { authConfig } from './../../app.config';
import { provideRouter } from '@angular/router';

describe('CourseCreateComponent', () => {
  let component: CourseCreateComponent;
  let fixture: ComponentFixture<CourseCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OAuthModule.forRoot({ resourceServer: { sendAccessToken: true } }),
        CourseCreateComponent,
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
    fixture = TestBed.createComponent(CourseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form on start', () => {
    expect(component.form.invalid).toBeTruthy();
  });

  it('should have valid form when all required fields are filled', () => {
    component.form.patchValue({
      name: 'Test Kurs',
      category: '1',
      courseLength: 10,
    });
    expect(component.form.valid).toBeTruthy();
  });

  it('should set error when name is too long', () => {
    component.form.patchValue({ name: 'a'.repeat(41) });
    expect(component.form.get('name')?.hasError('maxlength')).toBeTruthy();
  });
});