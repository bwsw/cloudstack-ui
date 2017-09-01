import { Component, Input } from '@angular/core';
import { BaseTemplateModel } from '../../shared/base-template.model';


@Component({
  selector: 'cs-template-os-icon',
  templateUrl: 'template-os-icon.component.html'
})
export class TemplateOsIconComponent {
  @Input() public template: BaseTemplateModel;
}
