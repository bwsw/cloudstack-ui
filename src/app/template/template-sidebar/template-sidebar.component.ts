import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseTemplateModel } from '../shared/base-template.model';


@Component({
  selector: 'cs-template-sidebar',
  templateUrl: 'template-sidebar.component.html',
  styleUrls: ['template-sidebar.component.scss']
})
export class TemplateSidebarComponent {
  @Input() public template: BaseTemplateModel;
  @Output() public deleteTemplate = new EventEmitter();

  public remove(): void {
    this.deleteTemplate.next(this.template);
  }
}
