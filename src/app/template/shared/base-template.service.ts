import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { BaseBackendCachedService } from '../../shared/services/base-backend-cached.service';
import { CSCommands } from '../../shared/services/base-backend.service';
import { TemplateTagService } from '../../shared/services/tags/template-tag.service';
import { BaseTemplateModel } from './base-template.model';
import { Utils } from '../../shared/services/utils/utils.service';


export const TemplateFilters = {
  community: 'community',
  executable: 'executable',
  featured: 'featured',
  self: 'self',
  selfExecutable: 'selfexecutable',
  sharedExecutable: 'sharedexecutable',
  all: 'all'
};

export const TemplateResourceType = {
  template: 'Template',
  iso: 'Iso'
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
  groupId?: string;
}

export interface CreateTemplateBaseParams {
  displayText: string;
  name: string;
  osTypeId: string;
  snapshotId?: string;
  groupId?: string;
  [propName: string]: any;
}

export class GroupedTemplates<T extends BaseTemplateModel> {
  public community: Array<T>;
  public executable: Array<T>;
  public featured: Array<T>;
  public self: Array<T>;
  public selfExecutable: Array<T>;
  public sharedExecutable: Array<T>;
  public all: Array<T>;

  constructor(templates: {}) {
    this.all = templates[TemplateFilters.all] || [];
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
      .concat(this.self)
      .concat(this.all);
  }
}


@Injectable()
export abstract class BaseTemplateService extends BaseBackendCachedService<BaseTemplateModel> {
  public onTemplateRemoved = new Subject<BaseTemplateModel>();
  private _templateFilters: Array<string>;

  constructor(
    protected asyncJobService: AsyncJobService,
    protected templateTagService: TemplateTagService,
    protected http: HttpClient
  ) {
    super(http);
    this._templateFilters = [
      TemplateFilters.featured,
      TemplateFilters.selfExecutable,
      TemplateFilters.community,
      TemplateFilters.sharedExecutable,
      TemplateFilters.executable,
      TemplateFilters.self,
      TemplateFilters.all
    ];
  }

  public get(id: string, params?: RequestParams): Observable<BaseTemplateModel> {
    const filter = params && params.filter ? params.filter : TemplateFilters.featured;
    return this.getList({ id, filter })
      .map(templates => templates[0])
      .catch(error => Observable.throw(error));
  }

  public getList(
    params: RequestParams,
    customApiFormat?: {},
    useCache = false
  ): Observable<Array<BaseTemplateModel>> {
    return this.getListWithDuplicates(params, useCache)
      .map(templates => this.distinctIds(templates))
      .catch((err) => {
        return Observable.of([]);
      });
  }

  public getListWithDuplicates(
    params: RequestParams,
    useCache = true
  ): Observable<Array<BaseTemplateModel>> {
    params[`${this.entity}filter`.toLowerCase()] = params.filter;
    delete params.filter;

    let maxSize: number;

    if (params && params['maxSize']) {
      maxSize = params['maxSize'];
      delete params['maxSize'];
    }

    return super.getList(params, null, useCache)
      .map(templates => {
        if (maxSize) {
          return templates.filter(
            template => Utils.convertToGb(template.size) <= maxSize);
        }
        return templates;
      })
      .catch((error) => {
        return Observable.of([]);
      });
  }

  public getWithGroupedZones(
    id: string,
    params?: RequestParams,
    useCache = true
  ): Observable<BaseTemplateModel> {
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

    return this.sendCommand(CSCommands.Register, params)
      .map(result => this.prepareModel(result[this.entity.toLowerCase()][0]))
      .switchMap(template => {
        if (params.groupId) {
          return this.templateTagService.setGroup(template, { id: params.groupId });
        } else {
          return Observable.of(template);
        }
      })
      .switchMap(template => {
        return this.templateTagService.setDownloadUrl(template, params.url)
          .catch(() => Observable.of(null))
          .do(tag => template.tags.push(tag));
      });
  }

  public remove(template: BaseTemplateModel): Observable<BaseTemplateModel> {
    this.invalidateCache();
    return this.sendCommand(CSCommands.Delete, {
      id: template.id,
      zoneId: template.zoneId
    })
      .switchMap(job => this.asyncJobService.queryJob(job.jobid))
      .map(() => {
        this.onTemplateRemoved.next(template);
        return template;
      });
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

    return Observable.forkJoin(...templateObservables)
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
