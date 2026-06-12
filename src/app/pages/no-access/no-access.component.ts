import { Component, inject } from '@angular/core';
import {AppAuthService} from '../../service/app.auth.service';
import {HeaderService} from './../../service/header.service';
import {OAuthService} from 'angular-oauth2-oidc';
import { Router } from '@angular/router';


import { AppLoginComponent } from '../../components/app-login/app-login.component';

@Component({
    selector: 'app-no-access',
    templateUrl: './no-access.component.html',
    styleUrls: ['./no-access.component.css'],
    imports: [AppLoginComponent]
})
export class NoAccessComponent {
  private authService = inject(AppAuthService);
  private headerService = inject(HeaderService);
  private router = inject(Router);
  oauthService = inject(OAuthService);


  constructor() {
    this.headerService.setPage('nav.noaccess');
  }

  public login() {
    this.authService.login();
  }
  back(): void {
    this.router.navigate(['/']);
  }

}
