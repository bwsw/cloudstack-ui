import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseTemplateModel } from '../shared/base-template.model';


@Component({
  selector: 'cs-base-template-sidebar',
  templateUrl: './base-template-sidebar.component.html',
  styleUrls: ['./base-template-sidebar.component.scss']
})
export class BaseTemplateSidebarComponent {
  @Input() public template: BaseTemplateModel;
  @Output() public deleteTemplate = new EventEmitter();

  public remove(): void {
    this.deleteTemplate.next(this.template);
  }
}
