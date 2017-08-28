import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { BaseModel } from '../models';
import { Cache } from './cache';
import { CacheService } from './cache.service';
import { ErrorService } from './error.service';
import { ServiceLocator } from './service-locator';
import { CustomQueryEncoder } from '../../utils/custom-query-encoder/custom-query-encoder';


export const BACKEND_API_URL = 'client/api';

export interface ApiFormat {
  command?: string;
  entity?: string;
}

export abstract class BaseBackendService<M extends BaseModel> {
  protected entity: string;
  protected entityModel: { new (params?): M; };

  protected error: ErrorService;
  protected http: Http;

  protected requestCache: Cache<Observable<Array<M>>>;

  constructor() {
    this.error = ServiceLocator.injector.get(ErrorService);
    this.http = ServiceLocator.injector.get(Http);
    this.initRequestCache();
  }

  public get(id: string): Observable<M> {
    if (!id) {
      throw Error('BaseBackendService.get id not specified!');
    }

    return this.getList()
      .map(res => res.find(entity => entity.id === id));
  }

  public getList(params?: {}, customApiFormat?: ApiFormat): Observable<Array<M>> {
    const cachedRequest = this.requestCache.get(params);
    if (cachedRequest) {
      return cachedRequest;
    }

    const result = this.makeGetListObservable(params, customApiFormat);
    this.requestCache.set({ params, result });
    return result;
  }

  public create(params?: {}, customApiFormat?: ApiFormat): Observable<any> {
    const command = customApiFormat && customApiFormat.command || 'create';
    const _entity = customApiFormat && customApiFormat.entity;

    return this.sendCommand(command, params, _entity)
      .map(response => {
        const entity = this.entity.toLowerCase();
        if (entity === 'tag' || entity === 'affinitygroup') {
          return response;
        }

        return this.prepareModel(response[entity] as M);
      });
  }

  public remove(params?: {}, customApiFormat?: ApiFormat): Observable<any> {
    const command = customApiFormat && customApiFormat.command || 'delete';
    const entity = customApiFormat && customApiFormat.entity;

    return this.sendCommand(command, params, entity);
  }

  protected prepareModel(res, entityModel?): M {
    if (entityModel) {
      return new entityModel(res);
    }
    return new this.entityModel(res);
  }

  protected buildParams(command: string, params?: {}, entity?: string): URLSearchParams {
    const urlParams = new URLSearchParams(undefined, new CustomQueryEncoder());
    urlParams.append('command', this.getRequestCommand(command, entity));

    for (const key in params) {
      if (!params.hasOwnProperty(key)) {
        continue;
      }

      if (!Array.isArray(params[key])) {
        urlParams.set(key.toLowerCase(), params[key]);
        continue;
      }

      const result = this.breakParamsArray(params, key);
      for (const param in result) {
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
    return this.http.get(BACKEND_API_URL,
      {
        search: this.buildParams(command, params, entity)
      }
    )
      .map((res: Response) => res.json())
      .catch(error => this.handleError(error));
  }

  protected getResponse(result: any): any {
    const responseKeys = Object.keys(result);
    if (responseKeys.length !== 1) {
      throw new Error('wrong response');
    }

    return result[responseKeys[0]];
  }


  protected postRequest(command: string, params?: {}): Observable<any> {
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(BACKEND_API_URL, this.buildParams(command, params), { headers })
      .map((res: Response) => res.json())
      .catch(error => this.handleError(error));
  }

  protected sendCommand(command: string, params?: {}, entity?: string): Observable<any> {
    return this.getRequest(command, params, entity)
      .map(res => this.getResponse(res))
      .catch(error => this.handleCommandError(error));
  }

  protected handleCommandError(error): Observable<any> {
    return Observable.throw(ErrorService.parseError(this.getResponse(error)));
  }

  protected formatGetListResponse(response: any): Array<M> {
    let entity = this.entity.toLowerCase();
    if (entity === 'asyncjob') { // only if list?
      entity += 's';
    }

    const result = response[entity];
    if (!result) {
      return [];
    }
    return result.map(m => this.prepareModel(m)) as Array<M>;
  }

  private makeGetListObservable(params?: {}, customApiFormat?: ApiFormat): Observable<Array<M>> {
    const command = customApiFormat && customApiFormat.command || 'list;s';
    const entity = customApiFormat && customApiFormat.entity;
    return this.sendCommand(command, params, entity)
      .map(response => this.formatGetListResponse(response))
      .share();
  }

  private breakParamsArray(params: {}, arrayName: string): any {
    const array = params[arrayName];
    const result = {};

    array.forEach((elem, index) => {
      for (const property in elem) {
        if (!elem.hasOwnProperty(property)) {
          continue;
        }

        const indexString = `${arrayName}[${index}].${property}`;
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

  private handleError(response): Observable<any> {
    const error = response.json();
    this.error.next(response);
    return Observable.throw(error);
  }

  private initRequestCache(): void {
    const cacheTag = `${this.entity}RequestCache`;
    this.requestCache = ServiceLocator.injector
      .get(CacheService)
      .get<Observable<Array<M>>>(cacheTag);
  }
}
