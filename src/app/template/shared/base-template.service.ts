import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { BaseBackendCachedService } from '../../shared/services/base-backend-cached.service';
import { OsTypeService } from '../../shared/services/os-type.service';
import { TagService } from '../../shared/services/tag.service';
import { Utils } from '../../shared/services/utils.service';

import { BaseTemplateModel } from './base-template.model';


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

export class GroupedTemplates<T extends BaseTemplateModel> {
  public community: Array<T>;
  public executable: Array<T>;
  public featured: Array<T>;
  public self: Array<T>;
  public selfExecutable: Array<T>;
  public sharedExecutable: Array<T>;

  constructor(templates: {}) {
    this.community = templates[TemplateFilters.community] || [];
    this.executable = templates[TemplateFilters.executable] || [];
    this.featured = templates[TemplateFilters.featured] || [];
    this.self = templates[TemplateFilters.self] || [];
    this.selfExecutable = templates[TemplateFilters.selfExecutable] || [];
    this.sharedExecutable = templates[TemplateFilters.sharedExecutable] || [];
  }

  public toArray(): Array<T> {
    return []
      .concat(this.featured)
      .concat(this.selfExecutable)
      .concat(this.community)
      .concat(this.sharedExecutable)
      .concat(this.executable)
      .concat(this.self);
  }
}

export const DOWNLOAD_URL = 'csui.template.download-url';

@Injectable()
export abstract class BaseTemplateService extends BaseBackendCachedService<BaseTemplateModel> {
  private _templateFilters: Array<string>;

  constructor(
    protected asyncJobService: AsyncJobService,
    protected osTypeService: OsTypeService,
    protected tagService: TagService
  ) {
    super();
    this._templateFilters = [
      TemplateFilters.featured,
      TemplateFilters.selfExecutable,
      TemplateFilters.community,
      TemplateFilters.sharedExecutable,
      TemplateFilters.executable,
      TemplateFilters.self
    ];
  }

  public get(id: string, params?: RequestParams): Observable<BaseTemplateModel> {
    const filter = params && params.filter ? params.filter : TemplateFilters.featured;
    return this.getList({ id, filter })
      .map(templates => templates[0])
      .catch(error => Observable.throw(error));
  }

  public getList(params: RequestParams, customApiFormat?: {}, useCache = true): Observable<Array<BaseTemplateModel>> {
    return this.getListWithDuplicates(params, useCache)
      .map(templates => this.distinctIds(templates))
      .catch(() => Observable.of([]));
  }

  public getListWithDuplicates(params: RequestParams, useCache = true): Observable<Array<BaseTemplateModel>> {
    params[`${this.entity}filter`.toLowerCase()] = params.filter;
    delete params.filter;

    let maxSize: number;

    if (params && params['maxSize']) {
      maxSize = params['maxSize'];
      delete params['maxSize'];
    }

    return Observable.forkJoin(
      super.getList(params, null, useCache),
      this.osTypeService.getList()
    )
      .map(([templates, osTypes]) => {
        templates.forEach(template => {
          template.osType = osTypes.find(osType => osType.id === template.osTypeId);
        });
        return templates;
      })
      .map(templates => {
        if (maxSize) {
          return templates.filter(template => Utils.convertToGB(template.size) <= maxSize);
        }
        return templates;
      })
      .catch(() => Observable.of([]));
  }

  public getWithGroupedZones(id: string, params?: RequestParams, useCache = true): Observable<BaseTemplateModel> {
    const filter = params && params.filter ? params.filter : TemplateFilters.featured;
    return this.getListWithDuplicates({ id, filter }, useCache)
      .map(templates => {
        if (templates.length) {
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
        }

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

  public getGroupedTemplates<T extends BaseTemplateModel>(
    params?: {},
    filters?: Array<string>,
    distinct = true
  ): Observable<GroupedTemplates<T>> {
    const _params = params || {};
    let localFilters = this._templateFilters;
    if (filters) {
      if (filters.includes('all')) {
        filters = Object.keys(TemplateFilters).map((key) => TemplateFilters[key]);
      }
      localFilters = filters;
    }

    const templateObservables = [];
    for (const filter of localFilters) {
      const requestParams = Object.assign({}, _params, { filter });
      const templates = distinct
        ? this.getList(requestParams)
        : this.getListWithDuplicates(requestParams);

      templateObservables.push(templates);
    }

    return Observable.forkJoin(templateObservables)
      .map(data => {
        const obj = {};
        data.forEach((templateSet, i) => {
          obj[localFilters[i]] = templateSet;
        });
        return new GroupedTemplates<T>(obj);
      });
  }

  private distinctIds(templates: Array<BaseTemplateModel>): Array<BaseTemplateModel> {
    const ids = {};
    const result = [];
    for (let i = 0; i < templates.length; i++) {
      if (!ids[templates[i].id]) {
        ids[templates[i].id] = true;
        result.push(templates[i]);
      }
    }
    return result;
  }
}
