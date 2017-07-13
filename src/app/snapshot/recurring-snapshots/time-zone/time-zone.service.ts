import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';


const url = 'config/timezones.json';

export interface TimeZone {
  geo: string;
  zone: string;
}

@Injectable()
export class TimeZoneService {
  constructor(public http: Http) {}

  public get(): Observable<Array<TimeZone>> {
    return this.http.get(url)
      .map(_ => _.json())
      .catch(() => this.handleError());
  }

  private handleError(): Observable<any> {
    return Observable.throw('Unable to load time zones');
  }
}
