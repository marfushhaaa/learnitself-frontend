import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { authConfig } from '../../app.config';
import { provideRouter } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OAuthModule.forRoot({ resourceServer: { sendAccessToken: true } }),
        DashboardComponent,
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
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty useralias on start', () => {
    expect(component.useralias()).toBe('');
  });

  it('should have empty username on start', () => {
    expect(component.username()).toBe('');
  });

  it('should have empty roles on start', () => {
    expect(component.roles()).toEqual([]);
  });

  it('should have empty initials on start', () => {
    expect(component.initials()).toBe('');
  });

  it('should return false for isAdmin when no roles', () => {
    expect(component.isAdmin()).toBe(false);
  });

  it('should return true for isAdmin when admin role is set', () => {
    component.roles.set(['admin', 'user']);
    expect(component.isAdmin()).toBe(true);
  });

  it('should return correct greeting for morning', () => {
    const date = new Date();
    date.setHours(8);
    vi.setSystemTime(date);
    expect(component.getGreeting()).toBe('Guten Morgen');
  });

  it('should return correct greeting for afternoon', () => {
    const date = new Date();
    date.setHours(14);
    vi.setSystemTime(date);
    expect(component.getGreeting()).toBe('Guten Tag');
  });

  it('should return correct greeting for evening', () => {
    const date = new Date();
    date.setHours(20);
    vi.setSystemTime(date);
    expect(component.getGreeting()).toBe('Guten Abend');
  });
});