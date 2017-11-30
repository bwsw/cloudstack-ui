import { Injectable } from '@angular/core';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { Observable } from 'rxjs/Observable';
import { TagService } from './tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import { TemplateTagKeys } from './template-tag-keys';
import { TemplateGroup } from '../../models/template-group.model';
import { Tag } from '../../models/tag.model';


@Injectable()
export class TemplateTagService implements EntityTagService {
  public keys = TemplateTagKeys;

  constructor(protected tagService: TagService) {
  }

  public getDownloadUrl(template: BaseTemplateModel): Observable<string> {
    return this.tagService.getTag(template, this.keys.downloadUrl)
      .map(tag => this.tagService.getValueFromTag(tag));
  }

  public setDownloadUrl(
    template: BaseTemplateModel,
    downloadUrl: string
  ): Observable<BaseTemplateModel> {
    return this.tagService.update(
      template,
      template.resourceType,
      this.keys.downloadUrl,
      downloadUrl
    );
  }

  public setGroup(
    template: BaseTemplateModel,
    group: TemplateGroup
  ): Observable<BaseTemplateModel> {
    return this.tagService.update(
      template,
      template.resourceType,
      this.keys.group,
      group && group.id
    );
  }

  public resetGroup(template: BaseTemplateModel): Observable<BaseTemplateModel> {
    const tag = template.tags.find(_ => _.key === this.keys.group);
    return this.tagService.remove({
      resourceIds: tag.resourceId,
      resourceType: tag.resourceType,
      'tags[0].key': tag.key
    });
  }

  public getAgreement(template: BaseTemplateModel, lang?: string): Observable<string> {
    const defaultAgreement = this.keys.agreementDefault;
    let langKey;

    if (lang) {
       langKey = `${defaultAgreement}.${lang}`;
    }

    const tagValue = this.tagService.getValueFromTag(template.tags
      .find(item => item.key === (langKey || defaultAgreement)));

    return Observable.of(tagValue || null);
  }

  public setAgreement(template: BaseTemplateModel, filePath: string): Observable<BaseTemplateModel> {
    return this.tagService.update(
      template,
      template.resourceType,
      this.keys.agreementDefault,
      filePath
    );
  }
}
