import { Http, URLSearchParams, Response, Headers } from '@angular/http';
import { BaseModel } from '../models/base.model';
import { ErrorService } from '.';
import { ServiceLocator } from './service-locator';

import 'rxjs/add/operator/toPromise';

export const BACKEND_API_URL = '/client/api';

export abstract class BaseBackendService<M extends BaseModel> {
  protected entity: string;
  protected entityModel: { new (params?): M; };

  protected http: Http;
  protected error: ErrorService;

  constructor() {
    this.http = ServiceLocator.injector.get(Http);
    this.error = ServiceLocator.injector.get(ErrorService);
  }

  public get(id: string): Promise<M> {
    return this.fetchList({ id })
      .then(res => this.prepareModel(res[0]) as M);
  }

  public getList(params?: {}): Promise<Array<M>> {
    return this.fetchList(params)
      .then(res => {
        if (!res) {
          return [];
        }
        return res.map(m => this.prepareModel(m)) as Array<M>;
      });
  }

  protected prepareModel(res): M {
    return new this.entityModel(res);
  }

  protected buildParams(command: string, params?: {}): URLSearchParams {
    const urlParams = new URLSearchParams();
    const cmd = command.split(';');
    let apiCommand = `${cmd[0]}${this.entity}`;

    if (cmd[0] === 'list') {
      apiCommand += 's';
    }
    if (cmd.length === 2) {
      apiCommand += cmd[1];
    }
    urlParams.append('command', apiCommand);

    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        urlParams.set(key, params[key]);
      }
    }

    urlParams.set('response', 'json');
    return urlParams;
  }

  protected postRequest(command: string, params?: {}): Promise<any> {
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(BACKEND_API_URL, this.buildParams(command, params), { headers })
      .toPromise()
      .then((res: Response) => res.json())
      .catch(error => {
        this.error.next(error);
        return Promise.reject(error);
      } );
  }

  private fetchList(params?: {}): Promise<any> {
    const command = 'list';
    let entity = this.entity.toLowerCase();

    return this.http.get(BACKEND_API_URL, { search: this.buildParams(command, params) })
      .toPromise()
      .then((res: Response) => {
        const responseString = `${command}${entity}sresponse`;
        if (entity === 'asyncjob') {
          entity += 's';
        }
        return res.json()[responseString][`${entity}`];
      })
      .catch(error => {
        this.error.next(error);
        return Promise.reject(error);
      });
  }
}
