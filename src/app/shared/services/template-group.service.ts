import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TemplateTagService } from './tags/template-tag.service';
import { BaseTemplateModel } from '../../template/shared/base-template.model';
import { ConfigService } from './config.service';
import { TemplateGroup } from '../models/template-group.model';

@Injectable()
export class TemplateGroupService {
  constructor(
    private templateTagService: TemplateTagService,
    private configService: ConfigService
  ) {
  }

  public getList(): Observable<Array<TemplateGroup>> {
    return Observable.of(this.configService.get('templateGroups'));
  }

  public add(
    template: BaseTemplateModel,
    group: TemplateGroup
  ): Observable<BaseTemplateModel> {
    return this.templateTagService.setGroup(template, group)
      .catch(() => Observable.of(template));
  }
}
