import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { INetworkSecurityGroup } from './security-group/security-group.service';
import 'rxjs/add/operator/toPromise';

interface IConfig {
  securityGroupTemplates: Array<INetworkSecurityGroup>;
}

@Injectable()
export class ConfigService {

  private config: IConfig;

  constructor(private http: Http) {}

  public load(reload = false): Promise<void> {
    if (reload || !this.config) {
      return this.http.get('/config-dev.json')
        .toPromise()
        .then(response => { this.config = response.json(); })
        .catch(error => {
          if (error.status === 404) {
            return this.http.get('/config-prod.json')
              .toPromise()
              .then(response => { this.config = response.json(); })
              .catch(this.handleError);
          }
        }).catch(this.handleError);
    } else {
      Promise.resolve();
    }
  }

  public get(key: string): Promise<any> {
    if (this.config) {
      return Promise.resolve(this.config[key]);
    } else {
      return this.load().then(() => this.config[key]);
    }
  }

  private handleError(e) {
    return Promise.reject('Unable to access config file');
  }
}
