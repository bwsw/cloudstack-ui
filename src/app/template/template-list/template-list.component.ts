import { Component, Input, Optional, EventEmitter, Output } from '@angular/core';
import { BaseTemplateModel } from '../shared/base-template.model';
import { ListService } from '../../shared/components/list/list.service';
import { Template } from '../shared/template.model';


export type TemplateDisplayMode = 'CARD' | 'LIST';

export const TemplateDisplayModes = {
  CARD: 'CARD' as TemplateDisplayMode,
  LIST: 'LIST' as TemplateDisplayMode
};

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
  @Input() public displayMode: TemplateDisplayMode;
  @Output() public deleteTemplate = new EventEmitter();
  @Output() public selectedTemplateChange = new EventEmitter();

  constructor(@Optional() private listService: ListService) {}

  public get displayModeList(): boolean {
    return this.displayMode === TemplateDisplayModes.LIST;
  }

  public get displayModeCard(): boolean {
    return this.displayMode === TemplateDisplayModes.CARD;
  }

  public selectTemplate(template: BaseTemplateModel): void {
    if (this.listService) {
      this.listService.onSelected.next(template);
    }
    this.selectedTemplate = template;
    this.selectedTemplateChange.emit(this.selectedTemplate);
  }

  public removeTemplate(template: Template): void {
    this.deleteTemplate.next(template);
  }
}
