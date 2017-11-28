import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { TemplateFilterListComponent } from '../../../template/template-filter-list/template-filter-list.component';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'cs-vm-creation-template-dialog',
  templateUrl: 'vm-template-dialog.component.html'
})
export class VmTemplateDialogComponent extends TemplateFilterListComponent {
  public _selectedTemplate: BaseTemplateModel;
  @Input() public zoneId: string;

  @Input()
  public set preselectedTemplate(value: BaseTemplateModel) {
    this.selectedTemplate = value;
  };

  @Output() close = new EventEmitter();

  public get selectedTemplate(): BaseTemplateModel {
    return this._selectedTemplate;
  }

  public set selectedTemplate(template: BaseTemplateModel) {
    this._selectedTemplate = template;
  }

  constructor(
    translate: TranslateService,
    authService: AuthService,
    private dialogRef: MatDialogRef<VmTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    super(translate, authService);

    this.zoneId = data.zoneId;
    this.preselectedTemplate = data.template;
  }


  public onOk() {
    const data = Object.assign({} , this.selectedTemplate ? this.selectedTemplate : this.preselectedTemplate);

    this.dialogRef.close(data);
  }

  public onCancel(): void {
    this.dialogRef.close(this.preselectedTemplate);
  }
}
