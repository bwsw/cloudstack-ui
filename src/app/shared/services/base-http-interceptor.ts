import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SnackBarService } from '../../core/services';
import { RouterUtilsService } from './router-utils.service';
import { AuthService } from './auth.service';

@Injectable()
export class BaseHttpInterceptor implements HttpInterceptor {
  private authService: AuthService;
  private router: Router;
  private routerUtilsService: RouterUtilsService;
  private notificationService: SnackBarService;

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(AuthService);
    this.router = this.injector.get(Router);
    this.routerUtilsService = this.injector.get(RouterUtilsService);
    this.notificationService = this.injector.get(SnackBarService);
    const user = this.authService.user;
    const sessionKey = user && user.sessionkey;
    const httpOptions = {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
      }),
    };
    const cloneParams = sessionKey
      ? { params: req.params.set('sessionKey', sessionKey), ...httpOptions }
      : httpOptions;
    const request = req.clone(cloneParams);

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.notificationService.open('AUTH.NOT_LOGGED_IN').subscribe();
            const route = this.routerUtilsService.getRouteWithoutQueryParams();
            if (route !== '/login' && route !== '/logout') {
              this.router.navigate(
                ['/logout'],
                this.routerUtilsService.getRedirectionQueryParams(),
              );
            }
          }
        },
      ),
    );
  }
}
