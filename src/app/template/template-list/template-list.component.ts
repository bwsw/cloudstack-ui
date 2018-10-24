import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseTemplateModel } from '../shared/base-template.model';

@Component({
  selector: 'cs-template-list',
  templateUrl: 'template-list.component.html',
  styleUrls: ['template-list.component.scss'],
})
export class TemplateListComponent {
  @Input()
  public radio = false;
  @Input()
  public templateList: BaseTemplateModel[];
  @Input()
  public query: string;
  @Input()
  public selectedTemplate: BaseTemplateModel;
  @Input()
  public dialogMode: boolean;
  @Input()
  public isLoading = false;
  @Output()
  public deleteTemplate = new EventEmitter();
  @Output()
  public selectedTemplateChange = new EventEmitter();

  public selectTemplate(template: BaseTemplateModel): void {
    this.selectedTemplate = template;
    this.selectedTemplateChange.emit(this.selectedTemplate);
  }
}
