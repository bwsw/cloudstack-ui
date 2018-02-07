import { Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { RouterUtilsService } from './router-utils.service';
import { AuthService } from './auth.service';

@Injectable()
export class BaseHttpInterceptor implements HttpInterceptor {
  private authService: AuthService;
  private router: Router;
  private routerUtilsService: RouterUtilsService;
  private notificationService: NotificationService;

  constructor(
    private injector: Injector
  ) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.authService = this.injector.get(AuthService);
    this.router = this.injector.get(Router);
    this.routerUtilsService = this.injector.get(RouterUtilsService);
    this.notificationService = this.injector.get(NotificationService);
    const user = this.authService.user;
    const sessionKey = user && user.sessionkey;
    const httpOptions = {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
      })
    };
    const requestWithHeaders = req.clone(httpOptions);
    const request = sessionKey ? requestWithHeaders.clone({
      params: requestWithHeaders.params.set('sessionKey', sessionKey)
    }) : requestWithHeaders;

    return next.handle(request).do((event: HttpEvent<any>) => {

    }, (err: any) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {

        this.notificationService.message('AUTH.NOT_LOGGED_IN');
        const route = this.routerUtilsService.getRouteWithoutQueryParams();
        if (route !== '/login' && route !== '/logout') {
          this.router.navigate(
            ['/logout'],
            this.routerUtilsService.getRedirectionQueryParams()
          );
        }
      }

    });

  }
}
