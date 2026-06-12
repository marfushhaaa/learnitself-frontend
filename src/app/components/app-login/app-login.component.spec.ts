import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLoginComponent } from './app-login.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthConfig, OAuthModule } from 'angular-oauth2-oidc';
import { authConfig } from '../../app.config';

describe('AppLoginComponent', () => {
  let component: AppLoginComponent;
  let fixture: ComponentFixture<AppLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OAuthModule.forRoot({ resourceServer: { sendAccessToken: true } }),
        AppLoginComponent,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthConfig, useValue: authConfig },
      ],
      teardown: { destroyAfterEach: true },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty useralias on start', () => {
    expect(component.useralias()).toBe('');
  });

  it('should split full name into first and last name correctly', () => {
    const fullName = 'Marharyta Oberemok';
    component.username_f.set(fullName.split(' ').slice(0, -1).join(' '));
    component.username_l.set(fullName.split(' ').slice(-1).join(' '));

    expect(component.username_f()).toBe('Marharyta');
    expect(component.username_l()).toBe('Oberemok');
  });

  it('should handle single name correctly', () => {
    const fullName = 'Marharyta';
    component.username_f.set(fullName.split(' ').slice(0, -1).join(' '));
    component.username_l.set(fullName.split(' ').slice(-1).join(' '));

    expect(component.username_l()).toBe('Marharyta');
  });
});