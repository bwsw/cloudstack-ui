import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListService } from '../../shared/components/list/list.service';
import { Template } from '../shared';
import { BaseTemplateModel } from '../shared/base-template.model';
import { TemplateComponent } from '../template/template.component';
import { OsType } from '../../shared/models/os-type.model';


@Component({
  selector: 'cs-template-card-list',
  templateUrl: 'template-card-list.component.html',
  styleUrls: ['template-list.component.scss']
})
export class TemplateCardListComponent implements OnInit {
  @Input() public templateList: Array<BaseTemplateModel>;
  @Input() public query: string;
  @Input() public groupings: string;
  @Input() public osTypes: Array<OsType>;
  @Output() public deleteTemplate = new EventEmitter();

  public TemplateComponent = TemplateComponent;
  public inputs;
  public outputs;

  constructor(public listService: ListService) {
    this.selectTemplate = this.selectTemplate.bind(this);
    this.removeTemplate = this.removeTemplate.bind(this);
  }

  public ngOnInit() {
    this.inputs = {
      searchQuery: () => this.query,
      isSelected: (item: BaseTemplateModel) => this.listService.isSelected(item.id),
      osTypes: this.osTypes
    };
    this.outputs = {
      onClick: this.selectTemplate,
      deleteTemplate: this.removeTemplate
    };
  }

  public selectTemplate(template: BaseTemplateModel): void {
    this.listService.showDetails(`${template.path}/${template.id}`);
  }

  public removeTemplate(template: Template): void {
    this.deleteTemplate.next(template);
  }
}
