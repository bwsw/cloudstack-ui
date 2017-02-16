import { Http, URLSearchParams, Response, Headers } from '@angular/http';
import { BaseModel } from '../models/base.model';
import { ErrorService } from '.';
import { ServiceLocator } from './service-locator';
import { Observable } from 'rxjs/Rx';

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

  public get(id: string): Observable<M> {
    return this.getList({ id })
      .map(res => res[0] as M);
  }

  public getList(params?: {}): Observable<Array<M>> {
    return this.sendCommand('list', params)
      .map(response => {
        let entity = this.entity.toLowerCase();
        if (entity === 'asyncjob') { // only if list?
          entity += 's';
        }

        const result = response[entity];
        if (!result) {
          return [];
        }
        return result.map(m => this.prepareModel(m)) as Array<M>;
      });
  }

  public create(params?: {}): Observable<any> {
    return this.sendCommand('create', params)
      .map(response => {
        let entity = this.entity.toLowerCase();
        if (entity === 'tag') {
          return response;
        }

        return this.prepareModel(response[entity] as M);
      });
  }

  public remove(params?: {}): Observable<any> {
    return this.sendCommand('delete', params);
  }

  protected prepareModel(res): M {
    return new this.entityModel(res);
  }

  protected buildParams(command: string, params?: {}): URLSearchParams {
    const urlParams = new URLSearchParams();
    const cmd = command.split(';');
    let apiCommand = `${cmd[0]}${this.entity}`;

    if (cmd[0] === 'list' || this.entity === 'Tag') {
      apiCommand += 's';
    }
    if (cmd.length === 2) {
      apiCommand += cmd[1];
    }
    urlParams.append('command', apiCommand);

    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        urlParams.set(key.toLowerCase(), params[key]);
      }
    }

    urlParams.set('response', 'json');
    return urlParams;
  }

  protected getRequest(command: string, params?: {}): Observable<any> {
    return this.http.get(BACKEND_API_URL, {
      search: this.buildParams(command, params)
    }).map((res: Response) => res.json())
      .catch(error => this.handleError(error));
  }

  protected postRequest(command: string, params?: {}): Observable<any> {
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(BACKEND_API_URL, this.buildParams(command, params), { headers })
      .map((res: Response) => res.json())
      .catch(error => this.handleError(error));
  }

  protected sendCommand(command: string, params?: {}): Observable<any> {
    return this.getRequest(command, params)
      .map(res => {
        let entity = this.entity.toLowerCase();
        let [cmd, postfix] = command.split(';');
        if (!postfix) {
          postfix = '';
        }
        let fix = (cmd === 'list' || entity === 'tag') ? 's' : '';

        if (command === 'restore') {
          entity = 'vm';
          fix = '';
        }

        const responseString = `${cmd}${entity}${fix}${postfix}response`.toLowerCase();

        return res[responseString];
      })
      .catch(error => this.handleError(error));
  }

  private handleError(error): Observable<any> {
    this.error.send(error);
    return Observable.throw(error);
  }
}
