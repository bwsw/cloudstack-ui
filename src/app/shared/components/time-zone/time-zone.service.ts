import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


const url = 'config/timezones.json';

export interface TimeZone {
  geo: string;
  zone?: string;
}

@Injectable()
export class TimeZoneService {
  constructor(public http: HttpClient) {}

  public get(): Observable<Array<TimeZone>> {
    return this.http.get(url)
      .catch(() => this.handleError());
  }

  private handleError(): Observable<any> {
    return Observable.throw('Unable to load time zones');
  }
}
