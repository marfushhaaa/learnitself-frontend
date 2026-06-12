import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private pageSubject = new BehaviorSubject<string>('');
  public readonly pageObservable: Observable<string> = this.pageSubject.asObservable();

  public setPage(page: string) {
    this.pageSubject.next(page);
  }
}
