import { Input } from '@angular/core';

import { BaseTemplateModel, downloadUrl } from '../../shared/base-template.model';
import * as moment from 'moment';

export abstract class BaseTemplateDetailsComponent {
  @Input()
  public entity: BaseTemplateModel;

  public get downloadUrl() {
    return downloadUrl;
  }

  public get templateCreated(): Date {
    return moment(this.entity.created).toDate();
  }

  public get templateTypeTranslationToken(): string {
    const type = (this.entity && (this.entity as any).templatetype) || '';
    const templateTypeTranslations = {
      BUILTIN: 'Built-in',
      USER: 'User',
    };

    return templateTypeTranslations[type];
  }
}
