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

  public get(key: string | Array<string>): Observable<any> {
    if (Array.isArray(key)) {
      // if (this.config) {
      //   let result = [];
      //
      //   for (let k in this.config) {
      //     if ((this.config as Object).hasOwnProperty(k)) {
      //       result.push(this.config[k]);
      //     }
      //   }
      //
      //   return Observable.of(result);
      // } else {
      //   return this.load().map(() => this.config[key]);
      // }
    } else {
      if (this.config) {
        return Observable.of(this.config[key]);
      } else {
        return this.load().map(() => this.config[key]);
      }
    }
  }

  private load(reload = false): Observable<any> {
    if (reload || !this.config) {
      const url = `/config-${isDevMode() ? 'dev' : 'prod'}.json`;
      return this.http.get(url)
        .map(response => {
          this.config = response.json();
        })
        .catch(() => this.handleError());
    } else {
      return Observable.of(null);
    }
  }

  private handleError(): Observable<any> {
    return Observable.throw('Unable to access config file');
  }
}
