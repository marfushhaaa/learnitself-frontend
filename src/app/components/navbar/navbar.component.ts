import { Component, signal, inject, OnInit } from '@angular/core';
import { AppAuthService } from '../../service/app.auth.service';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { AppLoginComponent } from '../../components/app-login/app-login.component';

@Component({
  selector: 'app-navbar',
  imports: [AppLoginComponent], 
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private authService = inject(AppAuthService);
  private router = inject(Router);
  oauthService = inject(OAuthService);
  useralias = signal('');
  username = signal('');

  ngOnInit(): void {
  this.oauthService.events
    .pipe(filter(e => e.type === 'token_received'))
    .subscribe(() => {
      this.authService.useraliasObservable.subscribe(alias => {
      this.useralias.set(alias);
    });
    this.authService.usernameObservable.subscribe(name => {
      this.username.set(name);
    });

      // URL bereinigen erst NACH token_received
      this.router.navigate([], {
        queryParams: {},
        replaceUrl: true
      });
    });

  if (this.oauthService.hasValidAccessToken()) {
    this.authService.useraliasObservable.subscribe(alias => {
      this.useralias.set(alias);
    });
    this.authService.usernameObservable.subscribe(name => {
      this.username.set(name);
    });
  }
}

  logout(): void {
    this.authService.logout();
  }
}