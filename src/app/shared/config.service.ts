import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

interface IConfig {
  config: { isProd: string };
  securityGroupTemplates: Array<INetworkSecurityGroup>;
}

interface INetworkSecurityGroup {
  name: string;
  rules: Array<INetworkRule>;
}

interface INetworkRule {
  type: string;
  protocol: string;
  firstPort: number;
  lastPort: number;
}

@Injectable()
export class ConfigService {

  private config: IConfig;

  constructor(private http: Http) {}

  public load(reload = false): Promise<void> {
    return this.http.get('/config-dev.json')
      .toPromise()
      .then(response => { this.config = response.json(); })
      .catch(error => {
        return this.http.get('/config-prod.json')
          .toPromise()
          .then(response => { this.config = response.json(); })
          .catch(this.handleError);
      });
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
