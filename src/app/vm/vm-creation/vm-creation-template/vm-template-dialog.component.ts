import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

import { Template } from '../../../template/shared';
import { PRESELECTED_TEMPLATE_TOKEN } from './injector-token';
import { TemplateFilterListComponent } from '../../../template/template-filter-list/template-filter-list.component';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';


@Component({
  selector: 'cs-vm-creation-template-dialog',
  templateUrl: 'vm-template-dialog.component.html',
  styleUrls: ['vm-template-dialog.component.scss']
})
export class VmTemplateDialogComponent extends TemplateFilterListComponent implements OnInit {
  public _selectedTemplate: BaseTemplateModel;

  constructor(
    @Inject(PRESELECTED_TEMPLATE_TOKEN) public preselectedTemplate: Template,
    private dialog: MdlDialogReference,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.selectedTemplate = this.preselectedTemplate;
  }

  public get selectedTemplate(): BaseTemplateModel {
    return this._selectedTemplate;
  }

  public set selectedTemplate(template: BaseTemplateModel) {
    this._selectedTemplate = template;
  }

  public onOk(): void {
    this.dialog.hide(this.selectedTemplate);
  }

  public onCancel(): void {
    this.dialog.hide(this.preselectedTemplate);
  }
}
