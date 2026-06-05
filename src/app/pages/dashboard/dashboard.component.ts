import { Component, OnInit, inject, signal } from '@angular/core';
import {AppAuthService} from '../../service/app.auth.service';
import {HeaderService} from '../../service/header.service';
import { AppLoginComponent } from '../../components/app-login/app-login.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [AppLoginComponent]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AppAuthService);
  private headerService = inject(HeaderService);

  useralias = signal('');
  username = signal('');

  constructor() {
    this.headerService.setPage('nav.dashboard');
  }

  ngOnInit(): void {
    this.authService.usernameObservable.subscribe(name => {
      this.username.set(name);
    });
    this.authService.useraliasObservable.subscribe(alias => {
      this.useralias.set(alias);
    });
  }

}