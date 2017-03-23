import { Http, URLSearchParams, Response, Headers } from '@angular/http';
import { BaseModel } from '../models/base.model';
import { ErrorService } from '.';
import { ServiceLocator } from './service-locator';
import { Observable } from 'rxjs/Rx';


export const BACKEND_API_URL = '/client/api';

export abstract class BaseBackendService<M extends BaseModel> {
  protected entity: string;
  protected entityModel: { new (params?): M; };

  protected error: ErrorService;
  protected http: Http;

  constructor() {
    this.error = ServiceLocator.injector.get(ErrorService);
    this.http = ServiceLocator.injector.get(Http);
  }

  public get(id: string): Observable<M> {
    return this.getList({ id })
      .map(res => res[0] as M);
  }

  public getList(params?: {}): Observable<Array<M>> {
    return this.sendCommand('list;s', params)
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
        if (entity === 'tag' || entity === 'affinitygroup') {
          return response;
        }

        return this.prepareModel(response[entity] as M);
      });
  }

  public remove(params?: {}): Observable<any> {
    return this.sendCommand('delete', params);
  }

  protected prepareModel(res, entityModel?): M {
    if (entityModel) {
      return new entityModel(res);
    }
    return new this.entityModel(res);
  }

  protected buildParams(command: string, params?: {}): URLSearchParams {
    const urlParams = new URLSearchParams();
    urlParams.append('command', this.getRequestCommand(command));

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

  // todo: check if it works for tags, delete etc.

  protected sendCommand(command: string, params?: {}): Observable<any> {
    return this.getRequest(command, params)
      .map(res => res[this.getResponseString(command)])
      .catch(error => this.handleError(error));
  }

  private getRequestCommand(command: string): string {
    const cmd = command.split(';');
    let apiCommand = `${cmd[0]}${this.entity}`;

    // fixing API's inconsistent behavior regarding commands
    if (this.entity === 'Tag') {
      apiCommand += 's';
    }
    if (cmd.length === 2) {
      apiCommand += cmd[1];
    }

    return apiCommand;
  }

  private getResponseString(command: string): string {
    let entity = this.entity.toLowerCase();
    let [cmd, postfix] = command.split(';');
    if (!postfix) {
      postfix = '';
    }

    // fixing API's inconsistent behavior regarding response strings
    let fix = (entity === 'tag') ? 's' : '';
    if (command === 'restore') {
      entity = 'vm';
      fix = '';
    }

    return `${cmd}${entity}${fix}${postfix}response`.toLowerCase();
  }

  private handleError(error): Observable<any> {
    this.error.send(error);
    return Observable.throw(error);
  }
}
