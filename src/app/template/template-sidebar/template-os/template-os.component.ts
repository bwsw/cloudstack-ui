import { Component, Input } from '@angular/core';
import { BaseTemplateModel } from '../../shared/base-template.model';


@Component({
  selector: 'cs-template-os',
  templateUrl: 'template-os.component.html'
})
export class TemplateOsComponent {
  @Input() public template: BaseTemplateModel;
}
