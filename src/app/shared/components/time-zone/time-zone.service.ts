import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError as throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


const url = 'config/timezones.json';

export interface TimeZone {
  geo: string;
  zone?: string;
}

@Injectable()
export class TimeZoneService {
  constructor(public http: HttpClient) {}

  public get(): Observable<Array<TimeZone>> {
    return this.http.get(url).pipe(
      catchError(() => this.handleError()));
  }

  private handleError(): Observable<any> {
    return throwError('Unable to load time zones');
  }
}
