import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseTemplateModel } from './base-template.model';
import { AsyncJobService, BaseBackendCachedService } from '../../shared/services';
import { OsTypeService } from '../../shared/services/os-type.service';
import { UtilsService } from '../../shared/services/utils.service';


export interface RequestParams {
  filter: string;
  [propName: string]: any;
}

export interface RegisterTemplateBaseParams {
  displayText: string;
  name: string;
  osTypeId: string;
  url?: string;
  zoneId?: string;
}

@Injectable()
export abstract class BaseTemplateService extends BaseBackendCachedService<BaseTemplateModel> {
  private _templateFilters: Array<string>;

  constructor(
    protected asyncJobService: AsyncJobService,
    protected osTypeService: OsTypeService,
    protected utilsService: UtilsService
  ) {
    super();
    this._templateFilters = ['featured', 'selfexecutable', 'community', 'sharedexecutable'];
  }

  public get(id: string, params?: RequestParams): Observable<BaseTemplateModel> {
    const filter = params && params.filter ? params.filter : 'featured';
    return this.getList(({ id, filter }))
      .map(templates => templates[0])
      .catch(error => Observable.throw(error));
  }

  public getList(params: RequestParams): Observable<Array<BaseTemplateModel>> {
    params[`${this.entity}filter`.toLowerCase()] = params.filter;
    delete params.filter;

    let maxSize: number;

    if (params && params['maxSize']) {
      maxSize = params['maxSize'];
      delete params['maxSize'];
    }

    return Observable.forkJoin([
      super.getList(params),
      this.osTypeService.getList()
    ])
      .map(([templates, osTypes]) => {
        templates = this.distinctIds(templates);
        templates.forEach(template => {
          template.osType = osTypes.find(osType => osType.id === template.osTypeId);
        });
        return templates;
      })
      .map(templates => {
        if (maxSize) {
          return templates.filter(template => this.utilsService.convertToGB(template.size) <= maxSize);
        }
        return templates;
      });
  }

  public register(params: RegisterTemplateBaseParams): Observable<BaseTemplateModel> {
    this.invalidateCache();
    return this.sendCommand('register', params)
      .map(result => this.prepareModel(result[this.entity.toLowerCase()][0]));
  }

  public remove(template: BaseTemplateModel): Observable<any> {
    this.invalidateCache();
    return this.sendCommand('delete', {
      id: template.id,
      zoneId: template.zoneId
    })
      .switchMap(job => this.asyncJobService.queryJob(job.jobid));
  }

  public addOsTypeData(template: BaseTemplateModel): Observable<BaseTemplateModel> {
    return this.osTypeService.getList()
      .map(osTypes => {
        template.osType = osTypes.find(osType => osType.id === template.osTypeId);
        return template;
      });
  }

  public getGroupedTemplates(params?: {}, filters?: Array<string>): Observable<Object> {
    let _params = params || {};
    let localFilters = this._templateFilters;
    if (filters) {
      if (filters.includes('all')) {
        filters = [
          'featured',
          'self',
          'selfexecutable',
          'sharedexecutable',
          'executable',
          'community'
        ];
      }
      localFilters = filters;
    }

    let templateObservables = [];
    for (let filter of localFilters) {
      const requestParams = Object.assign({}, _params, { filter });
      templateObservables.push(this.getList(requestParams as RequestParams));
    }

    return Observable.forkJoin(templateObservables)
      .map(data => {
        let obj = {};
        data.forEach((templateSet, i) => {
          obj[localFilters[i]] = templateSet;
        });
        return obj;
      });
  }

  public getDefault(zoneId: string, maxSize?: number): Observable<BaseTemplateModel> {
    return this.getGroupedTemplates({ zoneId, maxSize })
      .map(data => {
        for (let filter of this._templateFilters) {
          if (data[filter].length > 0) {
            return data[filter][0];
          }
        }
      })
      .catch(() => Observable.throw(0));
  }

  private distinctIds(templates: Array<BaseTemplateModel>): Array<BaseTemplateModel> {
    let ids = {};
    let result = [];
    for (let i = 0; i < templates.length; i++) {
      if (!ids[templates[i].id]) {
        ids[templates[i].id] = true;
        result.push(templates[i]);
      }
    }
    return result;
  }
}
