import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { InstanceGroupEnabledService } from '../../../shared/interfaces/instance-group-enabled-service';
import { AsyncJobService } from '../../../shared/services/async-job.service';
import { BaseBackendService } from '../../../shared/services/base-backend.service';
import { OsTypeService } from '../../../shared/services/os-type.service';
import { BaseTemplateTagService } from '../../../shared/services/tags/template/base/base-template-tag.service';
import { Utils } from '../../../shared/services/utils.service';
import { BaseTemplateModel } from './base-template.model';
import { GroupedTemplates } from './grouped-templates';
import { TemplateFilters } from './template-filters';
import { InstanceGroup } from '../../../shared/models/instance-group.model';


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
  snapshotId?: string
}


@Injectable()
export abstract class BaseTemplateService<M extends BaseTemplateModel>
  extends BaseBackendService<M> implements InstanceGroupEnabledService {

  public instanceGroupUpdateObservable = new Subject<M>();
  public onTemplateCreated = new Subject<M>();
  public onTemplateRemoved = new Subject<M>();
  private _templateFilters: Array<string>;

  constructor(
    protected asyncJobService: AsyncJobService,
    protected baseTemplateTagService: BaseTemplateTagService,
    protected osTypeService: OsTypeService
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

  public get(id: string, params?: RequestParams): Observable<M> {
    const filter = params && params.filter ? params.filter : TemplateFilters.featured;
    return this.getList({ id, filter })
      .map(templates => templates[0])
      .catch(error => Observable.throw(error));
  }

  public getList(params: RequestParams, customApiFormat?: {}, useCache = true): Observable<Array<M>> {
    return this.getListWithDuplicates(params, useCache)
      .map(templates => this.distinctIds(templates))
      .catch(() => Observable.of([]));
  }

  public getListWithDuplicates(params: RequestParams, useCache = true): Observable<Array<M>> {
    params[`${this.entity}filter`.toLowerCase()] = params.filter;
    delete params.filter;

    let maxSize: number;

    if (params && params['maxSize']) {
      maxSize = params['maxSize'];
      delete params['maxSize'];
    }

    return Observable.forkJoin(
      super.getList(params, null),
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

  public getWithGroupedZones(id: string, params?: RequestParams, useCache = true): Observable<M> {
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

  public register(params: RegisterTemplateBaseParams): Observable<M> {
    return this.sendCommand('register', params)
      .map(result => this.prepareModel(result[this.entity.toLowerCase()][0]))
  }

  public remove(template: M): Observable<any> {
    return this.sendCommand('delete', {
      id: template.id,
      zoneId: template.zoneId
    })
      .switchMap(job => this.asyncJobService.queryJob(job.jobid))
      .map(() => this.onTemplateRemoved.next(template));
  }

  public getGroupedTemplates(
    params?: {},
    filters?: Array<string>,
    distinct = true
  ): Observable<GroupedTemplates<M>> {
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
        return new GroupedTemplates<M>(obj);
      });
  }

  public addInstanceGroup(template: M, group: InstanceGroup): Observable<M> {
    return this.baseTemplateTagService.setGroup(template, group)
      .do(updatedTemplate => {
        this.instanceGroupUpdateObservable.next(updatedTemplate as M);
      })
      .catch(() => Observable.of(template)) as Observable<M>;
  }

  public getInstanceGroupList(): Observable<Array<InstanceGroup>> {
    return this.getGroupedTemplates()
      .map(groupedTemplates => groupedTemplates.toArray())
      .map(templateList => {
        return this.getInstanceGroupListFromTemplateList(templateList);
      });
  }

  private getInstanceGroupListFromTemplateList(templateList: Array<M>): Array<InstanceGroup> {
    return templateList.reduce((groups, template) => {
      const instanceGroupExists = template.instanceGroup;
      const instanceGroupAlreadyInList =
        instanceGroupExists &&
        groups.find(group => {
          return group.name === template.instanceGroup.name;
        });

      if (!instanceGroupExists || instanceGroupAlreadyInList) {
        return groups;
      } else {
        return groups.concat(template.instanceGroup);
      }
    }, []);
  }

  private distinctIds(templates: Array<M>): Array<M> {
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
