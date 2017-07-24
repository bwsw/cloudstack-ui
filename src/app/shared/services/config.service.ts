import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SecurityGroup } from '../../security-group/sg.model';
import { Observable } from 'rxjs/Observable';


interface IConfig {
  securityGroupTemplates: Array<SecurityGroup>;
}

const configUrl = 'config/config.json';

@Injectable()
export class ConfigService {
  private config: IConfig;
  private loadObservable: Observable<void>;

  constructor(private http: Http) {}

  public get(key: string | Array<string>): Observable<any | Array<any>> {
    const isArray = Array.isArray(key);

    if (this.config) {
      return Observable.of(this.getResult(isArray, key));
    }

    if (!this.loadObservable) {
      this.loadObservable = this.load().share();
    }
    return this.loadObservable.map(() => this.getResult(isArray, key));
  }

  private getResult(isArray: boolean, key: string | Array<string>): any {
    return isArray ? this.getArrayResult(key as Array<string>) : this.config[key as string];
  }

  private getArrayResult(keyArray: Array<string>): Object {
    const result = {};

    for (const key in this.config) {
      if (this.config.hasOwnProperty(key) && keyArray.includes(key)) {
        result[key] = this.config[key];
      }
    }

    return result;
  }

  private load(reload = false): Observable<any> {
    if (reload || !this.config) {
      return this.http.get(configUrl)
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
