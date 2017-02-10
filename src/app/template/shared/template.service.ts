import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { BackendResource } from '../../shared/decorators/backend-resource.decorator';
import { BaseBackendService } from '../../shared/services';
import { AsyncJobService } from '../../shared/services/async-job.service';
import { OsTypeService } from '../../shared/services/os-type.service';
import { Template } from './template.model';

interface TemplateRequestParams {
  templatefilter: string;
  [propName: string]: any;
}

@Injectable()
@BackendResource({
  entity: 'Template',
  entityModel: Template
})
export class TemplateService extends BaseBackendService<Template> {
  private templates: Object;
  private _templateFilters: Array<string>;

  constructor (
    private osTypeService: OsTypeService,
    private asyncJobService: AsyncJobService
  ) {
    super();
    this.templates = {};
    this._templateFilters = ['featured', 'selfexecutable', 'community', 'sharedexecutable'];
  }

  public get templateFilters(): Array<string> {
    return this._templateFilters;
  }

  public get(id: string, params?: TemplateRequestParams): Observable<Template> {
    const templatefilter = params && params.templatefilter ? params.templatefilter : 'featured';
    return Observable.forkJoin([
      this.getList({ templatefilter, id }),
      this.osTypeService.getList()
    ])
      .map(([templates, osTypes]) => {
        templates[0].osType = osTypes.find(osType => osType.id === templates[0].osTypeId);
        return templates[0];
      })
      .catch(error => Observable.throw(error));
  }

  public getList(params: TemplateRequestParams): Observable<Array<Template>> {
    if (this.templates.hasOwnProperty(params.templatefilter)) {
      return Observable.of(this.templates[params.templatefilter]);
    }

    let filter = params.templatefilter;
    return Observable.forkJoin([
      super.getList(params),
      this.osTypeService.getList()
    ])
      .map(([data, osTypes]) => {
        data.forEach(template => {
          template.osType = osTypes.find(osType => osType.id === template.osTypeId);
        });
        this.templates[filter] = data;
        return data;
      });
  }

  public getGroupedTemplates(params?: {}, templatefilters?: Array<string>): Observable<Object> {
    let _params = {};
    let localTemplateFilters = this._templateFilters;
    if (templatefilters) {
      if (templatefilters.includes('all')) {
        templatefilters = ['featured', 'self', 'selfexecutable', 'sharedexecutable', 'executable', 'community'];
      }
      localTemplateFilters = templatefilters;
    }
    if (params) {
      _params = params;
    }

    let templateObservables = [];
    for (let filter of localTemplateFilters) {
      _params['templatefilter'] = filter;
      templateObservables.push(this.getList(_params as TemplateRequestParams));
    }

    return Observable.forkJoin(templateObservables)
      .map(data => {
        let obj = {};
        data.forEach((templateSet, i) => {
          obj[localTemplateFilters[i]] = templateSet;
        });
        return obj;
      });
  }

  public delete(template: Template): Observable<any> {
    return this.getRequest('delete', {
      id: template.id,
      zoneid: template.zoneId
    })
      .switchMap(response => {
        return this.asyncJobService.addJob(response['deletetemplateresponse'].jobid);
      })
      .switchMap(jobResult => {
        if (jobResult.jobStatus === 2 || jobResult.jobResult && !jobResult.jobResult.success) {
          return Observable.throw(jobResult);
        }
        return Observable.of(null);
      });
  }

  public getDefault(): Observable<Template> {
    return this.getGroupedTemplates()
      .map(data => {
        for (let filter of this._templateFilters) {
          if (data.hasOwnProperty(filter)) {
            if (data[filter].length > 0) {
              return data[filter][0];
            }
          }
        }
      })
      .catch(() => Observable.throw(0));
  }
}
