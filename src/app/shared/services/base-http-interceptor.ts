import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BaseHttpInterceptor implements HttpInterceptor {

  constructor(
    private storage: LocalStorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const sessionKey = this.storage.read('sessionKey');
    if (sessionKey) {
      const duplicate = req.clone({ params: req.params.set('sessionKey', sessionKey) });
      return next.handle(duplicate);
    } else {
      return next.handle(req);
    }
  }
}
