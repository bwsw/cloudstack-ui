import { Component, Input } from '@angular/core';
import { BaseTemplateModel } from '../../shared/base-template.model';

@Component({
  selector: 'cs-template-description',
  templateUrl: 'template-description.component.html',
  styleUrls: ['template-description.component.scss'],
})
export class TemplateDescriptionComponent {
  @Input()
  public template: BaseTemplateModel;
}
