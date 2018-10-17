import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListService } from '../../shared/components/list/list.service';
import { Template } from '../shared';
import { BaseTemplateModel, getPath } from '../shared/base-template.model';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { TemplateCardItemComponent } from '../template/card-item/template-card-item.component';
import { TemplateRowItemComponent } from '../template/row-item/template-row-item.component';

@Component({
  selector: 'cs-template-card-list',
  templateUrl: 'template-card-list.component.html',
  styleUrls: ['template-list.component.scss'],
})
export class TemplateCardListComponent {
  @Input()
  public templateList: BaseTemplateModel[];
  @Input()
  public query: string;
  @Input()
  public groupings: string;
  @Input()
  public mode: ViewMode;
  @Output()
  public deleteTemplate = new EventEmitter();

  public inputs;
  public outputs;

  constructor(public listService: ListService) {
    this.selectTemplate = this.selectTemplate.bind(this);
    this.removeTemplate = this.removeTemplate.bind(this);

    this.inputs = {
      searchQuery: () => this.query,
      isSelected: (item: BaseTemplateModel) => this.listService.isSelected(item.id),
    };
    this.outputs = {
      onClick: this.selectTemplate,
      deleteTemplate: this.removeTemplate,
    };
  }

  public get itemComponent() {
    return this.mode === ViewMode.BOX ? TemplateCardItemComponent : TemplateRowItemComponent;
  }

  public selectTemplate(template: BaseTemplateModel): void {
    this.listService.showDetails(`${getPath(template)}/${template.id}`);
  }

  public removeTemplate(template: Template): void {
    this.deleteTemplate.next(template);
  }
}
