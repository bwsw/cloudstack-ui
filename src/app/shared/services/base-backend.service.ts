import { Http, URLSearchParams, Response, Headers } from '@angular/http';
import { BaseModel } from '../models/base.model';
import { AlertService } from './alert.service';

import 'rxjs/add/operator/toPromise';

const BACKEND_API_URL = '/client/api';

export abstract class BaseBackendService<M extends BaseModel> {
  protected entity: string;
  protected entityModel: { new (params?): M; };

  constructor(protected http: Http, protected alert: AlertService) { }

  public get(id: string): Promise<M> {
    return this.fetchList({ id })
      .then(res => this.prepareModel(res[0]) as M);
  }

  public getList(params?: {}): Promise<Array<M>> {
    return this.fetchList(params)
      .then(res => res.map(m => this.prepareModel(m)) as Array<M>);
  }

  protected prepareModel(res): M {
    return new this.entityModel(res);
  }

  protected buildParams(command: string, params?: {}): URLSearchParams {
    const urlParams = new URLSearchParams();
    let apiCommand = `${command}${this.entity}`;
    if (command === 'list') {
      apiCommand += 's';
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
      .catch(err => this.handleError(err));
  }

  private fetchList(params?: {}): Promise<any> {
    const command = 'list';
    const entity = this.entity.toLowerCase();

    return this.http.get(BACKEND_API_URL, { search: this.buildParams(command, params) })
      .toPromise()
      .then((res: Response) => {
        const responseString = `${command}${entity}sresponse`;
        return res.json()[responseString][`${entity}`];
      })
      .catch(error => this.handleError(error));
  }

  private handleError(error: Response): Promise<any> {
    let message: string;
    switch (error.status) {
      case 401:
        message = 'You are not logged in';
        this.alert.alert(message);
        return Promise.reject(message);

      case 431:
        message = 'Wrong arguments';
        this.alert.alert(message);
        return Promise.reject(message);

      default:
        return Promise.reject('Unknown error');
    }
  }
}
