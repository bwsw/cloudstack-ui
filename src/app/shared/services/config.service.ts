import { Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';
import { SecurityGroup } from '../../security-group/sg.model';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

interface IConfig {
  securityGroupTemplates: Array<SecurityGroup>;
}

@Injectable()
export class ConfigService {
  private config: IConfig;

  constructor(private http: Http) { }

  public load(reload = false): Observable<any> {
    if (reload || !this.config) {
      const url = `/config-${isDevMode() ? 'dev' : 'prod'}.json`;
      return this.http.get(url)
        .map(response => {
          this.config = response.json();
        }, error => {
          this.handleError(error);
        });
    } else {
      return Observable.of();
    }
  }

  public get(key: string): Observable<any> {
    if (this.config) {
      return Observable.of(this.config[key]);
    } else {
      return this.load().map(() => this.config[key]);
    }
  }

  private handleError(e): Observable<any> {
    return Observable.throw('Unable to access config file');
  }
}
