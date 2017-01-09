import { Injectable } from '@angular/core';
import { Template } from '../models';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendService } from './base-backend.service';

@Injectable()
@BackendResource({
  entity: 'Template',
  entityModel: Template
})
export class TemplateService extends BaseBackendService<Template> {
  private templates: Object;
  private _templateFilters: Array<string>;

  constructor () {
    super();
    this.templates = {};
    this._templateFilters = ['featured', 'selfexecutable', 'community', 'sharedexecutable'];
  }

  public get templateFilters(): Array<string> {
    return this._templateFilters;
  }

  public get(id: string): Promise<Template> {
    const templatefilter = 'featured';
    return this.getList({templatefilter, id})
      .then(data => data[0])
      .catch(error => Promise.reject(error));
  }

  public getList(params: { templatefilter: string, [propName: string]: any }): Promise<Array<Template>> {
    if (this.templates.hasOwnProperty(params.templatefilter)) {
      return Promise.resolve(this.templates[params.templatefilter]);
    }

    let filter = params.templatefilter;
    return super.getList(params)
      .then(data => this.templates[filter] = data);
  }

  public getGroupedTemplates(params?: {}, templatefilters?: Array<string>): Promise<Object> {
    let _params = {};
    let localTemplateFilters = this._templateFilters;
    if (templatefilters) {
      localTemplateFilters = templatefilters;
    }
    if (params) {
      _params = params;
    }

    let templatePromises = new Array<any>();
    for (let filter of localTemplateFilters) {
      _params['templatefilter'] = filter;
      templatePromises.push(this.getList(_params as  { templatefilter: string, [propName: string]: any }));
    }

    return Promise.all(templatePromises)
      .then(data => {
        let obj = {};
        data.forEach((templateSet, i) => {
          obj[localTemplateFilters[i]] = templateSet;
        });
        return obj;
      });
  }

  public getDefault(): Promise<Template> {
    return this.getGroupedTemplates()
      .then(data => {
        for (let filter of this._templateFilters) {
          if (data.hasOwnProperty(filter)) {
            if (data[filter].length > 0) {
              return data[filter][0];
            }
          }
        }
        return Promise.reject(0);
      });
  }
}
