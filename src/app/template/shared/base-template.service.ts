import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseTemplateModel } from './base-template.model';
import { AsyncJobService, BaseBackendCachedService } from '../../shared/services';
import { OsTypeService } from '../../shared/services/os-type.service';


export interface RequestParams {
  filter: string;
  [propName: string]: any;
}

export interface RegisterTemplateBaseParams {
  displayText: string;
  name: string;
  osTypeId: string;
  url: string;
  zoneId: string;
}

@Injectable()
export abstract class BaseTemplateService extends BaseBackendCachedService<BaseTemplateModel> {
  private _templateFilters: Array<string>;

  constructor(
    protected asyncJobService: AsyncJobService,
    protected osTypeService: OsTypeService
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

    return Observable.forkJoin([
      super.getList(params),
      this.osTypeService.getList()
    ])
      .map(([templates, osTypes]) => {
        templates.forEach(template => {
          template.osType = osTypes.find(osType => osType.id === template.osTypeId);
        });
        return templates;
      });
  }

  public register(params: RegisterTemplateBaseParams): Observable<BaseTemplateModel> {
    this.invalidateCache();
    return this.sendCommand('register', params)
      .map(result => (
        this.prepareModel(result[this.entity.toLowerCase()][0])
      ));
  }

  public remove(template: BaseTemplateModel): Observable<any> {
    this.invalidateCache();
    return this.sendCommand('delete', {
      id: template.id,
      zoneId: template.zoneId
    })
      .switchMap(job => this.asyncJobService.addJob(job.jobid))
      .switchMap(jobResult => {
        if (jobResult.jobStatus === 2 || jobResult.jobResult && !jobResult.jobResult.success) {
          return Observable.throw(jobResult);
        }
        return Observable.of(null);
      });
  }

  public addOsTypeData(template: BaseTemplateModel): Observable<BaseTemplateModel> {
    return this.osTypeService.getList()
      .map(osTypes => {
        template.osType = osTypes.find(osType => osType.id === template.osTypeId);
        return template;
      });
  }

  public getGroupedTemplates(params?: {}, filters?: Array<string>): Observable<Object> {
    let _params = {};
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
    if (params) {
      _params = params;
    }

    let templateObservables = [];
    for (let filter of localFilters) {
      _params['filter'] = filter;
      templateObservables.push(this.getList(_params as RequestParams));
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

  public getDefault(): Observable<BaseTemplateModel> {
    return this.getGroupedTemplates()
      .map(data => {
        for (let filter of this._templateFilters) {
          if (data[filter].length > 0) {
            return data[filter][0];
          }
        }
      })
      .catch(() => Observable.throw(0));
  }
}
