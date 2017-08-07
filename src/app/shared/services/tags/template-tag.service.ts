import { Injectable } from '@angular/core';
import { EntityTagService } from './entity-tag.service';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { Observable } from 'rxjs/Observable';
import { Tag } from '../../models/tag.model';


type TemplateTagKey = 'download-url';

@Injectable()
export class TemplateTagService extends EntityTagService {
  public keys = {
    downloadUrl: 'download-url' as TemplateTagKey
  };
  protected entityPrefix = 'template';

  public getDownloadUrl(template: BaseTemplateModel): Observable<string> {
    return this.tagService.getTag(template, this.keys.downloadUrl)
      .map(tag => this.getDownloadUrlFromTag(tag));
  }

  public setDownloadUrl(template, downloadUrl: string): Observable<BaseTemplateModel> {
    return this.tagService.update(
      template,
      template.resourceType,
      this.keys.downloadUrl,
      downloadUrl
    );
  }

  private getDownloadUrlFromTag(downloadUrlTag: Tag): string {
    if (downloadUrlTag) {
      return downloadUrlTag.value;
    }

    return '';
  }
}
