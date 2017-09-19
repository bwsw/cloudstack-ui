import { Component, Input } from '@angular/core';
import { Template } from '../../../shared/template/template.model';


@Component({
  selector: 'cs-template-general-information',
  templateUrl: 'template-general-information.component.html'
})
export class TemplateGeneralInformationComponent {
  @Input() public entity: Template;

  public get templateTypeTranslationToken(): string {
    const type = this.entity && (this.entity as any).type || '';
    const templateTypeTranslations = {
      'BUILTIN': 'Built-in',
      'USER': 'User'
    };

    return templateTypeTranslations[type];
  }
}
