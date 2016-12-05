import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ApiRequestBuilderService } from '../shared/api-request-builder.service';
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
export class ConfigReaderService {

  constructor(private http: Http, private requestBuilder: ApiRequestBuilderService) {}

  public getConfig(): Promise<IConfig> {
    return this.http.get('/config.json')
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(e) {
    return Promise.reject('Unable to access config file');
  }
}
