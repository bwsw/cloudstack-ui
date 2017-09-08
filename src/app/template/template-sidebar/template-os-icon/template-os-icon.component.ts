import { Component, Input } from '@angular/core';
import { BaseTemplateModel } from '../../shared/base/base-template.model';


@Component({
  selector: 'cs-template-os-icon',
  templateUrl: 'template-os-icon.component.html',
  styleUrls: ['template-os-icon.component.scss']
})
export class TemplateOsIconComponent {
  @Input() public template: BaseTemplateModel;
}
