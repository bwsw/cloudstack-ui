import { Injectable } from '@angular/core';
import { EntityTagService } from './entity-tag.service';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { Observable } from 'rxjs/Observable';
import { TagService } from './tag.service';


type TemplateTagKey = 'download-url';
const TemplateTagKeys = {
  downloadUrl: 'download-url' as TemplateTagKey
};

@Injectable()
export class TemplateTagService extends EntityTagService {
  public entityPrefix = 'template';
  public keys = TemplateTagKeys;

  constructor(protected tagService: TagService) {
    super(tagService);
    this.initKeys();
  }

  public getDownloadUrl(template: BaseTemplateModel): Observable<string> {
    return this.tagService.getTag(template, this.keys.downloadUrl)
      .map(tag => this.tagService.getValueFromTag(tag));
  }

  public setDownloadUrl(template, downloadUrl: string): Observable<BaseTemplateModel> {
    return this.tagService.update(
      template,
      template.resourceType,
      this.keys.downloadUrl,
      downloadUrl
    );
  }
}
