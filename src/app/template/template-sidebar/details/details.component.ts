import { Input } from '@angular/core';

import { BaseTemplateModel } from '../../shared/base-template.model';


export abstract class BaseTemplateDetailsComponent {
  @Input() public entity: BaseTemplateModel;

  public get templateTypeTranslationToken(): string {
    const type = this.entity && (this.entity as any).type || '';
    const templateTypeTranslations = {
      'BUILTIN': 'Built-in',
      'USER': 'User'
    };

    return templateTypeTranslations[type];
  }
}
