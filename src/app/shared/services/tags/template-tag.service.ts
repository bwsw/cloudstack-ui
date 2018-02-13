import { Injectable } from '@angular/core';
import { BaseTemplateModel } from '../../../template/shared';
import { Observable } from 'rxjs/Observable';
import { TagService } from './tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import { TemplateTagKeys } from './template-tag-keys';
import { TemplateGroup } from '../../models/template-group.model';


@Injectable()
export class TemplateTagService implements EntityTagService {
  public keys = TemplateTagKeys;

  constructor(protected tagService: TagService) {
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
      resourceIds: tag.resourceid,
      resourceType: tag.resourcetype,
      'tags[0].key': tag.key
    });
  }

  public getAgreement(template: BaseTemplateModel, lang?: string): Observable<string> {
    const defaultAgreement = this.keys.agreementDefault;
    let agreement;

    if (lang) {
      const langKey = `${defaultAgreement}.${lang}`;
      agreement = template.tags.find(item => item.key === langKey);
    }

    if (!agreement) {
      agreement = template.tags.find(item => item.key === defaultAgreement);
    }

    return Observable.of(this.tagService.getValueFromTag(agreement) || null);
  }
}
