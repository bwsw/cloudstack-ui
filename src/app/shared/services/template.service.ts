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
  public get(id: string): Promise<Template> {
    const templatefilter = 'featured';
    return this.getList({templatefilter, id})
      .then(data => data[0])
      .catch(error => Promise.reject(error));
  }

  public getList(params: { templatefilter: string, [propName: string]: any }): Promise<Array<Template>> {
    return super.getList(params);
  }
}
