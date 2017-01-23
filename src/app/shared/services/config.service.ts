import { Injectable, isDevMode } from '@angular/core';
import { Http } from '@angular/http';
import { SecurityGroup } from '../../security-group/sg.model';
import 'rxjs/add/operator/toPromise';

interface IConfig {
  securityGroupTemplates: Array<SecurityGroup>;
}

@Injectable()
export class ConfigService {
  private config: IConfig;

  constructor(private http: Http) { }

  public load(reload = false): Promise<void> {
    if (reload || !this.config) {
      const url = `/config-${isDevMode() ? 'dev' : 'prod'}.json`;
      return this.http.get(url)
        .toPromise()
        .then(response => this.config = response.json())
        .catch(this.handleError);
    } else {
      return Promise.resolve();
    }
  }

  public get(key: string): Promise<any> {
    if (this.config) {
      return Promise.resolve(this.config[key]);
    } else {
      return this.load().then(() => this.config[key]);
    }
  }

  private handleError(): Promise<any> {
    return Promise.reject('Unable to access config file');
  }
}
