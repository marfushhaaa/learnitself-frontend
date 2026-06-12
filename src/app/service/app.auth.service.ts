import { Injectable, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthConfig, OAuthErrorEvent, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, of } from 'rxjs';

interface DecodedToken {
  given_name?: string;
  family_name?: string;
  email?: string;
  preferred_username?: string;
  resource_access?: Record<string, { roles: string[] }>;
}

@Injectable({
  providedIn: 'root'
})
export class AppAuthService {
  private oauthService = inject(OAuthService);
  private authConfig = inject(AuthConfig);

  private jwtHelper: JwtHelperService = new JwtHelperService();
  private usernameSubject = new BehaviorSubject<string>('');
  public readonly usernameObservable: Observable<string> = this.usernameSubject.asObservable();
  private useraliasSubject = new BehaviorSubject<string>('');
  public readonly useraliasObservable: Observable<string> = this.useraliasSubject.asObservable();
  private accessTokenSubject = new BehaviorSubject<string>('');
  public readonly accessTokenObservable: Observable<string> = this.accessTokenSubject.asObservable();

  constructor() {
    this.handleEvents(null);
  }

  private _decodedAccessToken: DecodedToken | null = null;

  get decodedAccessToken(): DecodedToken | null {
    return this._decodedAccessToken;
  }

  private _accessToken = '';

  get accessToken(): string {
    return this._accessToken;
  }

  async initAuth(): Promise<void> {
    return new Promise<void>(() => {
      this.oauthService.configure(this.authConfig);
      this.oauthService.events
        .subscribe(e => this.handleEvents(e));
      this.oauthService.loadDiscoveryDocumentAndTryLogin();
      this.oauthService.setupAutomaticSilentRefresh();
    });
  }

  public getRoles(): Observable<string[]> {
    if (this._decodedAccessToken !== null) {
      return new Observable<string[]>(observer => {
        const roles = this._decodedAccessToken?.resource_access?.['learnitself']?.roles;
        if (roles) {
          if (Array.isArray(roles)) {
            observer.next(roles.map((r: string) => r.replace('ROLE_', '')));
          } else {
            observer.next([(roles as string).replace('ROLE_', '')]);
          }
        }
      });
    }
    return of([]);
  }

  public getIdentityClaims(): Record<string, unknown> {
    return this.oauthService.getIdentityClaims();
  }

  public logout(): void {
    this.oauthService.logOut();
    this.useraliasSubject.next('');
    this.usernameSubject.next('');
  }

  public login(): void {
    this.oauthService.initLoginFlow();
  }

  private handleEvents(event: OAuthEvent | null): void {
    if (event instanceof OAuthErrorEvent) {
      console.error(event);
    } else {
      this._accessToken = this.oauthService.getAccessToken();
      this.accessTokenSubject.next(this._accessToken);
      this._decodedAccessToken = this.jwtHelper.decodeToken(this._accessToken) as DecodedToken | null;

      if (this._decodedAccessToken?.family_name && this._decodedAccessToken?.given_name) {
        const username = this._decodedAccessToken.given_name + ' ' + this._decodedAccessToken.family_name;
        this.usernameSubject.next(username);
      }

      const claims = this.getIdentityClaims();
      if (claims !== null && claims['preferred_username'] !== '') {
        this.useraliasSubject.next(claims['preferred_username'] as string);
      }
    }
  }
}