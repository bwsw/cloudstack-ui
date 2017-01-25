import { Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';
import { SecurityGroup } from '../../security-group/sg.model';
import { Observable } from 'rxjs/Rx';

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
        })
        .catch(error => this.handleError());
    } else {
      return Observable.of(null);
    }
  }

  public get(key: string): Observable<any> {
    if (this.config) {
      return Observable.of(this.config[key]);
    } else {
      return this.load().map(() => this.config[key]);
    }
  }

  private handleError(): Observable<any> {
    return Observable.throw('Unable to access config file');
  }
}
