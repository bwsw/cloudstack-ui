import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Cache } from './cache';
import { CacheService } from './cache.service';
import { ErrorService } from './error.service';
import { BaseModelInterface } from '../models/base.model';
import * as range from 'lodash/range';

export const BACKEND_API_URL = 'client/api';

export interface ApiFormat {
  command?: string;
  entity?: string;
}

export const MAX_PAGE_SIZE = 500;

export interface FormattedResponse<M> {
  list: Array<M>,
  meta: {
    count: number
  }
}

export enum CSCommands {
  AddIpTo = 'addIpTo',
  Attach = 'attach',
  ChangeServiceFor = 'changeServiceFor',
  Create = 'create',
  Delete = 'delete',
  RemoveIpFrom = 'removeIpFrom',
  Deploy = 'deploy',
  Destroy = 'destroy',
  Detach = 'detach',
  Disable = 'disable',
  Enable = 'enable',
  Expunge = 'expunge',
  GetKeys = 'get;Keys',
  List = 'list;s',
  ListCapabilities = 'listCapabilities',
  QueryResult = 'query;Result',
  Reboot = 'reboot',
  Register = 'register',
  RegisterKeys = 'register;Keys',
  ResetForVM = 'reset;ForVirtualMachine',
  ResetPasswordFor = 'resetPasswordFor',
  Resize = 'resize',
  Restore = 'restore',
  Revert = 'revert',
  Start = 'start',
  Stop = 'stop',
  Update = 'update',
  UpdateVM = 'updateVM',
}

export abstract class BaseBackendService<M extends BaseModelInterface> {
  protected entity: string;
  protected entityModel?: { new (params?): M };

  protected requestCache: Cache<Observable<FormattedResponse<M>>>;

  constructor(
    protected http: HttpClient
  ) {
    this.initRequestCache();
  }

  public get(id: string): Observable<M> {
    if (!id) {
      throw Error('BaseBackendService.get id not specified!');
    }

    return this.getList().map(res => res.find(entity => entity.id === id));
  }

  public getListAll(params, customApiFormat?: ApiFormat): Observable<Array<M>> {
    const requestParams = Object.assign({}, this.extendParams(params), { all: true });
    return this.makeGetListObservable(requestParams, customApiFormat)
      .switchMap(result => {
        if (result.meta.count > result.list.length) {
          const numberOfCalls = Math.ceil(result.meta.count / MAX_PAGE_SIZE);
          return Observable.forkJoin(...range(2, numberOfCalls + 1).map(page => {
            return this.makeGetListObservable(
              Object.assign(
                {},
                requestParams,
                {
                  pageSize: MAX_PAGE_SIZE,
                  page
                }
              ),
              customApiFormat
            );
          })).map((results: Array<FormattedResponse<M>>) => {
            return results.reduce((memo, res) => {
              return Object.assign(memo, {
                list: memo.list.concat(res.list)
              });
            }, result);
          });
        } else {
          return Observable.of(result);
        }
      })
      .map(r => r.list);
  }

  public getList(params?: {}, customApiFormat?: ApiFormat): Observable<Array<M>> {
    return this.makeGetListObservable(this.extendParams(params), customApiFormat)
      .map(r => r.list);
  }

  public extendParams(params = {}) {
    return Object.assign({}, params, { listAll: 'true' });
  }

  public create(params?: {}, customApiFormat?: ApiFormat): Observable<any> {
    const command = (customApiFormat && customApiFormat.command) || CSCommands.Create;
    const _entity = customApiFormat && customApiFormat.entity;

    return this.sendCommand(command, params, _entity).map(response => {
      const entity = this.entity.toLowerCase();
      if (entity === 'tag' || entity === 'affinitygroup') {
        return response;
      }

      return this.prepareModel(response[entity] as M);
    });
  }

  public remove(params?: {}, customApiFormat?: ApiFormat): Observable<any> {
    const command = (customApiFormat && customApiFormat.command) || CSCommands.Delete;
    const entity = customApiFormat && customApiFormat.entity;

    return this.sendCommand(command, params, entity);
  }

  protected prepareModel(res, entityModel?): M {
    if (entityModel) {
      return new entityModel(res);
    } else if (this.entityModel) {
      return new this.entityModel(res);
    }
    return res;
  }

  protected buildParams(command: string, params?: {}, entity?: string): HttpParams {
    let urlParams = new HttpParams();
    urlParams = urlParams.set('command', this.getRequestCommand(command, entity));

    for (const key in params) {
      if (!params.hasOwnProperty(key)) {
        continue;
      }

      if (!Array.isArray(params[key])) {
        urlParams = urlParams.set(key.toLowerCase(), params[key]);
        continue;
      }

      const result = this.breakParamsArray(params, key);
      for (const param in result) {
        if (!result.hasOwnProperty(param)) {
          continue;
        }
        urlParams = urlParams.set(param, result[param]);
      }
    }

    urlParams = urlParams.set('response', 'json');
    return urlParams;
  }

  protected getRequest(
    command: string,
    params?: {},
    entity?: string
  ): Observable<any> {
    return this.http
      .get(
        BACKEND_API_URL, {
          params: this.buildParams(command, params, entity)
        });
  }

  protected getResponse(result: any): any {
    const responseKeys = Object.keys(result);
    if (responseKeys.length !== 1) {
      throw new Error('wrong response');
    }

    return result[responseKeys[0]];
  }

  protected postRequest(command: string, params?: {}): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    return this.http.post(
      BACKEND_API_URL,
      this.buildParams(command, params),
      { headers }
    );
  }

  protected sendCommand(
    command: string,
    params?: {},
    entity?: string
  ): Observable<any> {
    return this.getRequest(command, params, entity)
      .map(res => this.getResponse(res))
      .catch(e => this.handleCommandError(e.error));
  }

  protected handleCommandError(error): Observable<any> {
    return Observable.throw(ErrorService.parseError(this.getResponse(error)));
  }

  protected formatGetListResponse(response: any): FormattedResponse<M> {
    let entity = this.entity.toLowerCase();
    if (entity === 'asyncjob') {
      // only if list?
      entity += 's';
    }

    const result = response[entity] || [];
    return {
      list: result.map(m => this.prepareModel(m)) as Array<M>,
      meta: {
        count: response.count || 0
      }
    };
  }

  private makeGetListObservable(
    params?: {},
    customApiFormat?: ApiFormat
  ): Observable<FormattedResponse<M>> {

    const cachedRequest = this.requestCache.get(params);
    if (cachedRequest) {
      return cachedRequest;
    }
    const command = (customApiFormat && customApiFormat.command) || CSCommands.List;
    const entity = customApiFormat && customApiFormat.entity;
    const request = this.sendCommand(command, params, entity)
      .map(response => this.formatGetListResponse(response))
      .share();
    this.requestCache.set({ params, result: request });
    return request;
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

  private initRequestCache(): void {
    const cacheTag = `${this.entity}RequestCache`;
    this.requestCache = CacheService.create<Observable<FormattedResponse<M>>>(cacheTag);
  }
}
