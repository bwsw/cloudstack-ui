import { Http, URLSearchParams, Response, Headers } from '@angular/http';
import { BaseModel } from '../models/base.model';
import { ErrorService } from '.';
import { ServiceLocator } from './service-locator';
import { Observable } from 'rxjs';

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
    return this.fetchList({ id })
      .map(res => this.prepareModel(res[0]) as M);
  }

  public getList(params?: {}): Observable<Array<M>> {
    return this.fetchList(params)
      .map(res => {
        if (!res) {
          return [];
        }
        return res.map(m => this.prepareModel(m)) as Array<M>;
      });
  }

  public create(params?: {}): Observable<any> {
    const command = 'create';
    let entity = this.entity.toLowerCase();
    return this.getRequest(command, params)
      .map(res => {
        const ent = entity === 'tag' ? entity + 's' : entity;
        const response = res[`${command}${ent}response`];

        if (entity === 'tag') {
          return response;
        }
        return this.prepareModel(response[ent]);
      });
  }

  public remove(params?: {}): Observable<any> {
    const command = 'delete';
    let entity = this.entity.toLowerCase();
    return this.postRequest(command, params)
      .map(res => res[`${command}${entity}response`]);
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
        urlParams.set(key, params[key]);
      }
    }

    urlParams.set('response', 'json');
    return urlParams;
  }

  protected getRequest(command: string, params?: {}): Observable<any> {
    console.log('1111');
    return this.http.get(BACKEND_API_URL, {
      search: this.buildParams(command, params)
    }).map((res: Response) => {
      console.log('asd');
      return res.json();
    }, error => {
      console.log('qwe');
      this.handleError(error)
    });
  }

  protected postRequest(command: string, params?: {}): Observable<any> {
    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(BACKEND_API_URL, this.buildParams(command, params), { headers })
      .map((res: Response) => res.json())
      .catch(error => this.handleError(error));
  }

  private fetchList(params?: {}): Observable<any> {
    const command = 'list';
    let entity = this.entity.toLowerCase();

    return this.http.get(BACKEND_API_URL, { search: this.buildParams(command, params) })
      .map((res: Response) => {
        const responseString = `${command}${entity}sresponse`;
        if (entity === 'asyncjob') {
          entity += 's';
        }
        return res.json()[responseString][`${entity}`];
      })
      .catch(error => this.handleError(error));
  }

  private handleError(error): Observable<any> {
    this.error.next(error);
    return Observable.throw(error);
  }
}
