import { Component, inject, signal } from '@angular/core';
import {AppAuthService} from '../../service/app.auth.service';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-login',
    templateUrl: './app-login.component.html',
    styleUrls: ['./app-login.component.scss'],
    imports: []
})
export class AppLoginComponent {
  private authService = inject(AppAuthService);
  useralias = signal('');

  ngOnInit(): void {
    this.authService.useraliasObservable.subscribe(alias => {
      this.useralias.set(alias);
    });
  }

  public login() {
    this.authService.login();
  }

  public logout(): void {
    this.authService.logout();
  }
}
