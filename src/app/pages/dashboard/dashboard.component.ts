import { Component, OnInit, inject, signal } from '@angular/core';
import { filter } from 'rxjs';
import { Router } from '@angular/router';
import { AppAuthService } from '../../service/app.auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { AppLoginComponent } from '../../components/app-login/app-login.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [AppLoginComponent],
})
export class DashboardComponent implements OnInit {
  private authService = inject(AppAuthService);
  private oauthService = inject(OAuthService);
  private router = inject(Router);

  useralias = signal('');
  username = signal('');
  email = signal('');
  firstName = signal('');
  lastName = signal('');
  roles = signal<string[]>([]);
  initials = signal('');
  isLoading = signal(true);

  ngOnInit(): void {
    // wenn Token schon da (z.B. nach Reload)
    if (this.oauthService.hasValidAccessToken()) {
      this.loadUserInfo();
      this.isLoading.set(false);
    }

    // nach frischem Login
    this.oauthService.events.pipe(filter((e) => e.type === 'token_received')).subscribe(() => {
      this.loadUserInfo();
      this.isLoading.set(false);
    });
  }

  private loadUserInfo(): void {
    this.authService.usernameObservable.subscribe((name) => {
      this.username.set(name);
    });
    this.authService.useraliasObservable.subscribe((alias) => {
      this.useralias.set(alias);
    });

    const token = this.authService.decodedAccessToken;
    if (token) {
      this.firstName.set(token.given_name ?? '');
      this.lastName.set(token.family_name ?? '');
      this.email.set(token.email ?? '');

      const f = (token.given_name ?? '').charAt(0).toUpperCase();
      const l = (token.family_name ?? '').charAt(0).toUpperCase();
      this.initials.set(f + l);

      const clientRoles: string[] = token?.resource_access?.['learnitself']?.roles ?? [];
      this.roles.set(
        clientRoles
          .map(r => r.replace('ROLE_', ''))
          .sort((a, b) => {
            if (a.toLowerCase() === 'admin') return -1;
            if (b.toLowerCase() === 'admin') return 1;
            return 0;
          })
      );
    }
  }

  isAdmin(): boolean {
    return this.roles().includes('admin');
  }

  goToCourses(): void {
    this.router.navigate(['/courses']);
  }

  getGreeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Guten Morgen';
    if (h < 18) return 'Guten Tag';
    return 'Guten Abend';
  }
}
