import { Component, Input } from '@angular/core';
import { BaseTemplateModel } from '../../shared/base/base-template.model';


@Component({
  selector: 'cs-template-description',
  templateUrl: 'template-description.component.html'
})
export class TemplateDescriptionComponent {
  @Input() public template: BaseTemplateModel;
}
