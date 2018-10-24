import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseTemplateModel } from '../../shared/base-template.model';

@Component({
  selector: 'cs-template-actions-sidebar',
  templateUrl: 'template-actions-sidebar.component.html',
  styleUrls: ['template-actions-sidebar.component.scss'],
})
export class TemplateActionsSidebarComponent {
  @Input()
  public template: BaseTemplateModel;
  @Output()
  public deleteTemplate = new EventEmitter();
}
