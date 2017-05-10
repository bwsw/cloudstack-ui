import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BACKEND_API_URL } from './';


@Injectable()
export class HttpService extends Http {
  public onHttpRequest: Subject<void> = new Subject<void>();

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    if (!options || !options['refreshSession']) {
      this.onHttpRequest.next(null);
    }
    return super.get(url, options);
  }

  public refreshSession(): Observable<any> {
    const refreshSessionUrl = '?command=listUsers';
    return super.get(BACKEND_API_URL + refreshSessionUrl);
  }
}
