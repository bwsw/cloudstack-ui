import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Template } from '../../../template/shared';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { Iso } from '../../../template/shared/iso.model';
import { TemplateFilterListComponent } from '../../../template/template-filter-list/template-filter-list.component';

@Component({
  selector: 'cs-vm-creation-template-dialog',
  templateUrl: 'vm-template-dialog.component.html'
})
export class VmTemplateDialogComponent extends TemplateFilterListComponent {
  public _selectedTemplate: BaseTemplateModel;

  @Input() public templates: Array<BaseTemplateModel>;
  @Input() public zoneId: string;
  @Input() public set preselectedTemplate(value: BaseTemplateModel) {
    this.selectedTemplate = value;
  };
  @Output() close = new EventEmitter();
  public get typeOfSelectedSource(): 'Iso' | 'Template' {
    if (this.selectedTemplate instanceof Iso) {
      return 'Iso';
    }
    if (this.selectedTemplate instanceof Template) {
      return 'Template';
    }
  }

  public get selectedTemplate(): BaseTemplateModel {
    return this._selectedTemplate;
  }

  public set selectedTemplate(template: BaseTemplateModel) {
    this._selectedTemplate = template;
  }

  public onOk(template): void {
    this.close.emit(template);
  }

  public onCancel(): void {
    this.close.emit(this.preselectedTemplate);
  }
}
