import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BaseTemplateModel } from '../../../template/shared';
import { TagService } from './tag.service';
import { EntityTagService } from './entity-tag-service.interface';
import { templateTagKeys } from './template-tag-keys';
import { ImageGroup } from '../../models/config/image-group.model';
import { resourceType } from '../../../template/shared/base-template.model';

@Injectable()
export class TemplateTagService implements EntityTagService {
  public keys = templateTagKeys;

  constructor(protected tagService: TagService) {}

  public setDownloadUrl(
    template: BaseTemplateModel,
    downloadUrl: string,
  ): Observable<BaseTemplateModel> {
    return this.tagService.update(
      template,
      resourceType(template),
      this.keys.downloadUrl,
      downloadUrl,
    );
  }

  public setGroup(template: BaseTemplateModel, group: ImageGroup): Observable<BaseTemplateModel> {
    return this.tagService.update(
      template,
      resourceType(template),
      this.keys.group,
      group && group.id,
    );
  }

  public resetGroup(template: BaseTemplateModel): Observable<BaseTemplateModel> {
    const tag = template.tags.find(_ => _.key === this.keys.group);
    return this.tagService.remove({
      resourceIds: tag.resourceid,
      resourceType: tag.resourcetype,
      'tags[0].key': tag.key,
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

    return of(this.tagService.getValueFromTag(agreement) || null);
  }
}
