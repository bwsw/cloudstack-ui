import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseTemplateModel } from '../shared/base-template.model';


@Component({
  selector: 'cs-template-list',
  templateUrl: 'template-list.component.html',
  styleUrls: ['template-list.component.scss']
})
export class TemplateListComponent {
  @Input() public radio = false;
  @Input() public templateList: Array<BaseTemplateModel>;
  @Input() public query: string;
  @Input() public selectedTemplate: BaseTemplateModel;
  @Output() public selectedTemplateChange = new EventEmitter();

  public selectTemplate(template: BaseTemplateModel): void {
    this.selectedTemplateChange.emit(template);
    this.selectedTemplate = template;
  }
}
