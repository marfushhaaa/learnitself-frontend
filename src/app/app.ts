import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AppAuthService} from './service/app.auth.service';
import {OAuthService} from 'angular-oauth2-oidc';
import { NavbarComponent } from "./components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}
