import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference } from '../../../dialog/dialog-module';

import { Template } from '../../../template/shared';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { Iso } from '../../../template/shared/iso.model';
import { TemplateFilterListComponent } from '../../../template/template-filter-list/template-filter-list.component';
import { ISOS, PRESELECTED_TEMPLATE_TOKEN, TEMPLATES, ZONE } from './injector-token';


@Component({
  selector: 'cs-vm-creation-template-dialog',
  templateUrl: 'vm-template-dialog.component.html',
  styleUrls: ['vm-template-dialog.component.scss', '../../../shared/styles/iso-dialog.scss']
})
export class VmTemplateDialogComponent extends TemplateFilterListComponent implements OnInit {
  public _selectedTemplate: BaseTemplateModel;

  constructor(
    @Inject(PRESELECTED_TEMPLATE_TOKEN) public preselectedTemplate: Template,
    @Inject(TEMPLATES) public templates: Array<Template>,
    @Inject(ISOS) public isos: Array<Iso>,
    @Inject(ZONE) public zoneId: string,
    private dialog: MdlDialogReference
  ) {
    super();
  }

  public ngOnInit(): void {
    this.selectedTemplate = this.preselectedTemplate;
  }

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

  public onOk(): void {
    this.dialog.hide(this.selectedTemplate);
  }

  public onCancel(): void {
    this.dialog.hide(this.preselectedTemplate);
  }
}
