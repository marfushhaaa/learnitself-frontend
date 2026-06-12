import { Component, inject, signal, OnInit } from '@angular/core';
import {AppAuthService} from '../../service/app.auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './app-login.component.html',
    styleUrls: ['./app-login.component.scss'],
    imports: []
})
export class AppLoginComponent implements OnInit {
  private authService = inject(AppAuthService);
  useralias = signal('');
  username_f = signal('');
  username_l = signal('');
  

  ngOnInit(): void {
    this.authService.useraliasObservable.subscribe(alias => {
      this.useralias.set(alias);
    });
    this.authService.usernameObservable.subscribe(name => {
      this.username_f.set(name.split(' ').slice(0, -1).join(' '));
      this.username_l.set(name.split(' ').slice(-1).join(' '));
    });
  }

  public login() {
    this.authService.login();
  }

  public logout(): void {
    this.authService.logout();
  }
}
