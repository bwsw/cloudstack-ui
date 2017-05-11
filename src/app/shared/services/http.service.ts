import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BACKEND_API_URL } from './';


export const REFRESH_SESSION_URL = '?command=listUsers';

@Injectable()
export class HttpService extends Http {
  public onHttpRequest: Subject<void> = new Subject<void>();

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    this.onHttpRequest.next(null);
    return super.get(url, options);
  }

  public refreshSession(): void {
    super.get(BACKEND_API_URL + REFRESH_SESSION_URL).subscribe();
  }
}
