import { Injectable } from '@angular/core';
import { IsoTagKeys } from './iso-tag-keys';
import { BaseTemplateTagService } from '../base/base-template-tag.service';


@Injectable()
export class IsoTagService extends BaseTemplateTagService {
  public keys = IsoTagKeys;
}
