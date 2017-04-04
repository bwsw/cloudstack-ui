import { Http, URLSearchParams, Response, Headers } from '@angular/http';
import { BaseModel } from '../models';
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

  protected buildParams(command: string, params?: {}, entity?: string): URLSearchParams {
    const urlParams = new URLSearchParams();
    urlParams.append('command', this.getRequestCommand(command, entity));

    for (let key in params) {
      if (!params.hasOwnProperty(key)) {
        continue;
      }

      if (!Array.isArray(params[key])) {
        urlParams.set(key.toLowerCase(), params[key]);
        continue;
      }

      let result = this.breakParamsArray(params, key);
      for (let param in result) {
        if (!result.hasOwnProperty(param)) {
          continue;
        }
        urlParams.set(param, result[param]);
      }
    }

    urlParams.set('response', 'json');
    return urlParams;
  }

  protected getRequest(command: string, params?: {}, entity?: string): Observable<any> {
    return this.http.get(BACKEND_API_URL, {
      search: this.buildParams(command, params, entity)
    })
      .map((res: Response) => res.json())
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

  protected sendCommand(command: string, params?: {}, entity?: string): Observable<any> {
    return this.getRequest(command, params, entity)
      .map(res => this.getResponse(res))
      .catch(error => this.handleError(error));
  }

  private breakParamsArray(params: {}, arrayName: string): any {
    let array = params[arrayName];
    let result = {};

    array.forEach((elem, index) => {
      for (let property in elem) {
        if (!elem.hasOwnProperty(property)) {
          continue;
        }

        let indexString = `${arrayName}[${index}].${property}`;
        result[indexString] = elem[property];
      }
    });

    return result;
  }

  private getRequestCommand(command: string, entity?: string): string {
    const cmd = command.split(';');
    const ent = entity || this.entity;
    let apiCommand = `${cmd[0]}${ent}`;

    // fixing API's inconsistent behavior regarding commands
    if (ent === 'Tag') {
      apiCommand += 's';
    }
    if (cmd.length === 2) {
      apiCommand += cmd[1];
    }

    return apiCommand;
  }

  private getResponse(result: any): any {
    const responseKeys = Object.keys(result);
    if (responseKeys.length !== 1) {
      throw new Error('wrong response');
    }

    return result[responseKeys[0]];
  }

  private handleError(error): Observable<any> {
    this.error.send(error);
    return Observable.throw(error);
  }
}
