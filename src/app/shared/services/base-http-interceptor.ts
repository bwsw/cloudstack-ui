import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs/Observable';
import { Utils } from './utils/utils.service';


@Injectable()
export class BaseHttpInterceptor implements HttpInterceptor {

  constructor(
    private storage: LocalStorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const userRaw = this.storage.read('user');
    const user = Utils.parseJsonString(userRaw);
    const sessionKey = user && user.sessionkey;
    if (sessionKey) {
      const duplicate = req.clone({ params: req.params.set('sessionKey', sessionKey) });
      return next.handle(duplicate);
    } else {
      return next.handle(req);
    }
  }
}
