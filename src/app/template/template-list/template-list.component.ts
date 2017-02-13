import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Template } from '../shared/template.model';
import { Iso } from '../shared/iso.model';

@Component({
  selector: 'cs-template-list',
  templateUrl: 'template-list.component.html',
  styleUrls: ['template-list.component.scss']
})
export class TemplateListComponent {
  @Input() public radio = false;
  @Input() public templateList: Array<Template | Iso>;
  @Input() public query: string;
  @Output() public selectedTemplate = new EventEmitter();

  private _selectedTemplate: Template | Iso;

  public selectTemplate(template: Template | Iso): void {
    this.selectedTemplate.emit(template);
  }
}
