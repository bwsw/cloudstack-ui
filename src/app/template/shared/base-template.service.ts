import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseTemplateModel } from './base-template.model';
import { AsyncJobService, BaseBackendCachedService } from '../../shared/services';
import { OsTypeService } from '../../shared/services/os-type.service';
import { UtilsService } from '../../shared/services/utils.service';
import { TagService } from '../../shared/services/tag.service';

export const TemplateFilters = {
  community: 'community',
  executable: 'executable',
  featured: 'featured',
  self: 'self',
  selfExecutable: 'selfexecutable',
  sharedExecutable: 'sharedexecutable'
};

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
  entity: 'Iso' | 'Template';
}

export const DOWNLOAD_URL = 'DOWNLOAD_URL';

@Injectable()
export abstract class BaseTemplateService extends BaseBackendCachedService<BaseTemplateModel> {
  private _templateFilters: Array<string>;

  constructor(
    protected asyncJobService: AsyncJobService,
    protected osTypeService: OsTypeService,
    protected utilsService: UtilsService,
    protected tagService: TagService
  ) {
    super();
    this._templateFilters = [
      TemplateFilters.featured,
      TemplateFilters.selfExecutable,
      TemplateFilters.community,
      TemplateFilters.sharedExecutable
    ];
  }

  public get(id: string, params?: RequestParams): Observable<BaseTemplateModel> {
    const filter = params && params.filter ? params.filter : TemplateFilters.featured;
    return this.getList(({ id, filter }))
      .map(templates => templates[0])
      .catch(error => Observable.throw(error));
  }

  public getList(params: RequestParams, distinct = true, useCache = true): Observable<Array<BaseTemplateModel>> {
    params[`${this.entity}filter`.toLowerCase()] = params.filter;
    delete params.filter;

    let maxSize: number;

    if (params && params['maxSize']) {
      maxSize = params['maxSize'];
      delete params['maxSize'];
    }

    return Observable.forkJoin([
      super.getList(params, null, useCache),
      this.osTypeService.getList()
    ])
      .map(([templates, osTypes]) => {
        if (distinct) {
          templates = this.distinctIds(templates);
        }
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

  public getWithGroupedZones(id: string, params?: RequestParams, useCache = true): Observable<BaseTemplateModel> {
    const filter = params && params.filter ? params.filter : TemplateFilters.featured;
    return this.getList(({ id, filter }), false, useCache)
      .map(templates => {
        templates[0].zones = [];
        templates.forEach(template => {
          templates[0].zones.push({
            created: template.created,
            zoneId: template.zoneId,
            zoneName: template.zoneName,
            status: template.status,
            isReady: template.isReady
          });
        });

        return templates[0];
      });
  }

  public register(params: RegisterTemplateBaseParams): Observable<BaseTemplateModel> {
    this.invalidateCache();

    return this.sendCommand('register', params)
      .map(result => this.prepareModel(result[this.entity.toLowerCase()][0]))
      .switchMap(template => {
        return this.tagService.update(template, params.entity, DOWNLOAD_URL, params.url)
          .catch(() => Observable.of())
          .map(tag => {
            template.tags.push(tag);
            return template;
          });
      });
  }

  public remove(template: BaseTemplateModel): Observable<any> {
    this.invalidateCache();
    return this.sendCommand('delete', {
      id: template.id,
      zoneId: template.zoneId
    })
      .switchMap(job => this.asyncJobService.queryJob(job.jobid));
  }

  public getGroupedTemplates(params?: {}, filters?: Array<string>): Observable<Object> {
    let _params = params || {};
    let localFilters = this._templateFilters;
    if (filters) {
      if (filters.includes('all')) {
        filters = Object.keys(TemplateFilters).map((key) => TemplateFilters[key]);
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
            const readyTemplates = data[filter].filter(_ => _.isReady);
            if (readyTemplates.length) {
              return readyTemplates[0];
            }
          }
        }
        return undefined;
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
