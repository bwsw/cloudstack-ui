import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { TemplateFilterListComponent } from '../../../template/template-filter-list/template-filter-list.component';
import { AuthService } from '../../../shared/services/auth.service';
import { VmCreationAgreementComponent } from './agreement/vm-creation-agreement.component';
import { TemplateTagService } from '../../../shared/services/tags/template-tag.service';


@Component({
  selector: 'cs-vm-creation-template-dialog',
  templateUrl: 'vm-template-dialog.component.html'
})
export class VmTemplateDialogComponent extends TemplateFilterListComponent {
  public _selectedTemplate: BaseTemplateModel;
  @Input() public zoneId: string;

  constructor(
    translate: TranslateService,
    authService: AuthService,
    private dialogRef: MatDialogRef<VmTemplateDialogComponent>,
    private dialog: MatDialog,
    private templateTagService: TemplateTagService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    super(translate, authService);

    this.zoneId = data.zoneId;
    this.preselectedTemplate = data.template;
  }

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

  public onOk(): void {
    const dialogData = { template: this.selectedTemplate, agreement: false };

    this.templateTagService.getAgreement(this.selectedTemplate ? this.selectedTemplate : this.preselectedTemplate)
      .subscribe(res => {
        if (res) {
          this.showTemplateAgreementDialog()
            .finally(() => this.dialogRef.close(dialogData))
            .subscribe(item => {
            if (item) {
              dialogData.agreement = true;
            }
          })
        }
      });
  }

  public onCancel(): void {
    this.dialogRef.close(this.preselectedTemplate);
  }

  private showTemplateAgreementDialog(): Observable<any> {
    return this.dialog.open(VmCreationAgreementComponent, {
      width: '900px',
      data: this.selectedTemplate ? this.selectedTemplate : this.preselectedTemplate
    })
      .afterClosed();
  }
}
