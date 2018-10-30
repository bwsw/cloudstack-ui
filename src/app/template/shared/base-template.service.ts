import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { AsyncJobService } from '../../shared/services/async-job.service';
import { BaseBackendCachedService } from '../../shared/services/base-backend-cached.service';
import { CSCommands } from '../../shared/services/base-backend.service';
import { TemplateTagService } from '../../shared/services/tags/template-tag.service';
import { BaseTemplateModel } from './base-template.model';
import { Utils } from '../../shared/services/utils/utils.service';

export const templateFilters = {
  community: 'community',
  executable: 'executable',
  featured: 'featured',
  self: 'self',
  selfExecutable: 'selfexecutable',
  sharedExecutable: 'sharedexecutable',
  all: 'all',
};

export const templateResourceType = {
  template: 'Template',
  iso: 'Iso',
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
  public community: T[];
  public executable: T[];
  public featured: T[];
  public self: T[];
  public selfExecutable: T[];
  public sharedExecutable: T[];
  public all: T[];

  constructor(templates: {}) {
    this.all = templates[templateFilters.all] || [];
    this.community = templates[templateFilters.community] || [];
    this.executable = templates[templateFilters.executable] || [];
    this.featured = templates[templateFilters.featured] || [];
    this.self = templates[templateFilters.self] || [];
    this.selfExecutable = templates[templateFilters.selfExecutable] || [];
    this.sharedExecutable = templates[templateFilters.sharedExecutable] || [];
  }

  public toArray(): T[] {
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
  private filters: string[];

  constructor(
    protected asyncJobService: AsyncJobService,
    protected templateTagService: TemplateTagService,
    protected http: HttpClient,
  ) {
    super(http);
    this.filters = [
      templateFilters.featured,
      templateFilters.selfExecutable,
      templateFilters.community,
      templateFilters.sharedExecutable,
      templateFilters.executable,
      templateFilters.self,
      templateFilters.all,
    ];
  }

  public get(id: string, params?: RequestParams): Observable<BaseTemplateModel> {
    const filter = params && params.filter ? params.filter : templateFilters.featured;
    return this.getList({ id, filter }).pipe(
      map(templates => templates[0]),
      catchError(() => of(null)),
    );
  }

  public getList(
    params: RequestParams,
    customApiFormat?: {},
    useCache = false,
  ): Observable<BaseTemplateModel[]> {
    return this.getListWithDuplicates(params, useCache).pipe(
      map(templates => this.distinctIds(templates)),
      catchError(() => {
        return of([]);
      }),
    );
  }

  public getListWithDuplicates(
    params: RequestParams,
    useCache = true,
  ): Observable<BaseTemplateModel[]> {
    params[`${this.entity}filter`.toLowerCase()] = params.filter;
    delete params.filter;

    let maxSize: number;

    if (params && params['maxSize']) {
      maxSize = params['maxSize'];
      delete params['maxSize'];
    }

    return super.getList(params, null, useCache).pipe(
      map(templates => {
        if (maxSize) {
          return templates.filter(template => Utils.convertToGb(template.size) <= maxSize);
        }
        return templates;
      }),
      catchError(() => {
        return of([]);
      }),
    );
  }

  public getWithGroupedZones(
    id: string,
    params?: RequestParams,
    useCache = true,
  ): Observable<BaseTemplateModel> {
    const filter = params && params.filter ? params.filter : templateFilters.featured;
    return this.getListWithDuplicates({ id, filter }, useCache).pipe(
      map(templates => {
        if (templates.length) {
          templates[0].zones = [];

          templates.forEach(template => {
            templates[0].zones.push({
              created: template.created,
              zoneid: template.zoneid,
              zonename: template.zonename,
              status: template.status,
              isready: template.isready,
            });
          });
        }

        return templates[0];
      }),
    );
  }

  public register(params: RegisterTemplateBaseParams): Observable<BaseTemplateModel> {
    this.invalidateCache();

    return this.sendCommand(CSCommands.Register, params).pipe(
      map(result => result[this.entity.toLowerCase()][0]),
      switchMap(template => {
        if (params.groupId) {
          return this.templateTagService.setGroup(template, { id: params.groupId });
        }
        return of(template);
      }),
      switchMap(template => {
        return this.templateTagService.setDownloadUrl(template, params.url).pipe(
          catchError(() => of(null)),
          tap(tag => template.tags.push(tag)),
        );
      }),
    );
  }

  public remove(template: BaseTemplateModel): Observable<BaseTemplateModel> {
    this.invalidateCache();
    return this.sendCommand(CSCommands.Delete, {
      id: template.id,
      zoneId: template.zoneid,
    }).pipe(
      switchMap(job => this.asyncJobService.queryJob(job.jobid, this.entity)),
      map(() => {
        this.onTemplateRemoved.next(template);
        return template;
      }),
    );
  }

  public getGroupedTemplates<T extends BaseTemplateModel>(
    params?: {},
    filters?: string[],
    distinct = true,
  ): Observable<GroupedTemplates<T>> {
    const parameters = params || {};
    let localFilters = this.filters;
    if (filters) {
      if (filters.includes('all')) {
        // tslint:disable-next-line:no-parameter-reassignment
        filters = Object.keys(templateFilters).map(key => templateFilters[key]);
      }
      localFilters = filters;
    }

    const templateObservables: Observable<BaseTemplateModel[]>[] = [];
    for (const filter of localFilters) {
      const requestParams = { ...parameters, filter };
      const templates = distinct
        ? this.getList(requestParams)
        : this.getListWithDuplicates(requestParams);

      templateObservables.push(templates);
    }

    // todo
    // tslint:disable-next-line:deprecation
    return forkJoin(...templateObservables).pipe(
      map(data => {
        const obj = {};
        data.forEach((templateSet, i) => {
          obj[localFilters[i]] = templateSet;
        });

        return new GroupedTemplates<T>(obj);
      }),
    );
  }

  private distinctIds(templates: BaseTemplateModel[]): BaseTemplateModel[] {
    const ids = {};
    const result = [];
    for (const template of templates) {
      if (!ids[template.id]) {
        ids[template.id] = true;
        result.push(template);
      }
    }
    return result;
  }
}
