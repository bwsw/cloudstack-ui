import { Injectable } from '@angular/core';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { Observable } from 'rxjs/Observable';
import { TagService } from './tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import { TemplateTagKeys } from './template-tag-keys';
import { TemplateGroup } from '../../models/template-group.model';


@Injectable()
export class TemplateTagService implements EntityTagService {
  public keys = TemplateTagKeys;

  constructor(protected tagService: TagService) {}

  public getDownloadUrl(template: BaseTemplateModel): Observable<string> {
    return this.tagService.getTag(template, this.keys.downloadUrl)
      .map(tag => this.tagService.getValueFromTag(tag));
  }

  public setDownloadUrl(template: BaseTemplateModel, downloadUrl: string): Observable<BaseTemplateModel> {
    return this.tagService.update(
      template,
      template.resourceType,
      this.keys.downloadUrl,
      downloadUrl
    );
  }

  public setGroup(template: BaseTemplateModel, groupId: string): Observable<BaseTemplateModel> {
    return this.tagService.update(
      template,
      template.resourceType,
      this.keys.group,
      groupId);
  }
}
