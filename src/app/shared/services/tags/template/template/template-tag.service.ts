import { Injectable } from '@angular/core';
import { BaseTemplateTagService } from '../base/base-template-tag.service';
import { TemplateTagKeys } from './template-tag-keys';


@Injectable()
export class TemplateTagService extends BaseTemplateTagService {
  public keys = TemplateTagKeys;
}
