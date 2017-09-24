import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs/Observable';
import { Utils } from './utils/utils.service';import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { RouterUtilsService } from './router-utils.service';

@Injectable()
export class BaseHttpInterceptor implements HttpInterceptor {

  constructor(
    private storage: LocalStorageService,
    private notification: NotificationService,
    private routerUtilsService: RouterUtilsService,
    private router: Router
  ) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const userRaw = this.storage.read('user');
    const user = Utils.parseJsonString(userRaw);
    const sessionKey = user && user.sessionkey;
    const request = sessionKey ? req.clone({
      params: req.params.set(
        'sessionKey',
        sessionKey
      )
    }) : req;
    return next.handle(request).do((event: HttpEvent<any>) => {

    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.notification.message('AUTH.NOT_LOGGED_IN');
          const route = this.routerUtilsService.getRouteWithoutQueryParams();
          if (route !== '/login' && route !== '/logout') {
            this.router.navigate(
              ['/logout'],
              this.routerUtilsService.getRedirectionQueryParams()
            );
          }
        }
      }
    });

  }
}
