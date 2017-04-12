import { Component, Input, Optional, EventEmitter, Output } from '@angular/core';
import { BaseTemplateModel } from '../shared/base-template.model';
import { ListService } from '../../shared/components/list/list.service';


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
  @Input() public dialogMode: boolean;
  @Output() public selectedTemplateChange = new EventEmitter();

  constructor(@Optional() private listService: ListService) {}

  public selectTemplate(template: BaseTemplateModel): void {
    if (this.listService) {
      this.listService.onSelected.next(template);
    }
    this.selectedTemplate = template;
    this.selectedTemplateChange.emit(this.selectedTemplate);
  }
}
