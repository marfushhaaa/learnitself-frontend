import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDetailsComponent } from './course-details.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { authConfig } from '../../app.config';
import { provideRouter } from '@angular/router';

describe('CourseDetailsComponent', () => {
  let component: CourseDetailsComponent;
  let fixture: ComponentFixture<CourseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OAuthModule.forRoot({ resourceServer: { sendAccessToken: true } }),
        CourseDetailsComponent,
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
    fixture = TestBed.createComponent(CourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no course on start', () => {
    expect(component.course()).toBeNull();
  });

  it('should format date correctly', () => {
    expect(component.formatDate('2026-06-12')).toBe('12.06.2026');
  });
});