import { Component, Input } from '@angular/core';
import { BaseTemplateModel, IsoService, TemplateService } from '../shared';
import cloneDeep = require('lodash/cloneDeep');


@Component({
  selector: 'cs-template-tags',
  templateUrl: 'template-tags.component.html'
})
export class TemplateTagsComponent {
  @Input() public template: BaseTemplateModel;

  constructor(
    private isoService: IsoService,
    private templateService: TemplateService
  ) {}

  public updateTemplate(): void {
    const service = this.template.isTemplate ?
      this.templateService :
      this.isoService;

    service.invalidateCache();
    service.get(this.template.id)
      .subscribe(template => {
        const updatedTemplate = cloneDeep(this.template);
        updatedTemplate.tags = template.tags;
        this.template = updatedTemplate;
      });
  }
}
