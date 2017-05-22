import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListService } from '../../shared/components/list/list.service';
import { Template } from '../shared';
import { BaseTemplateModel } from '../shared/base-template.model';


@Component({
  selector: 'cs-template-card-list',
  templateUrl: 'template-card-list.component.html',
  styleUrls: ['template-list.component.scss']
})
export class TemplateCardListComponent {
  @Input() public templateList: Array<BaseTemplateModel>;
  @Input() public query: string;
  @Output() public deleteTemplate = new EventEmitter();

  constructor(public listService: ListService) {}

  public selectTemplate(template: BaseTemplateModel): void {
    this.listService.showDetails(`${template.path}/${template.id}`);
  }

  public removeTemplate(template: Template): void {
    this.deleteTemplate.next(template);
  }
}
