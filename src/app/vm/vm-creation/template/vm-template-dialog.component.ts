import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { BaseTemplateModel } from '../../../template/shared';
import { TemplateFilterListComponent } from '../../../template/template-filter-list/template-filter-list.component';
import { AuthService } from '../../../shared/services/auth.service';
import { OsFamily } from '../../../shared/models';
import { TemplateGroup } from '../../../shared/models/';

@Component({
  selector: 'cs-vm-creation-template-dialog',
  templateUrl: 'vm-template-dialog.component.html'
})
export class VmTemplateDialogComponent extends TemplateFilterListComponent implements OnInit {
  @Input() templates: BaseTemplateModel[];
  @Input() selectedTypes: string[];
  @Input() selectedOsFamilies: OsFamily[];
  @Input() selectedGroups: string[];
  @Input() viewMode: string;
  @Input() query: string;
  @Input() groups: TemplateGroup[];
  @Input() isLoading: boolean;
  @Input() preselectedTemplate: BaseTemplateModel;

  @Output() viewModeChange = new EventEmitter<string>();
  @Output() selectedTypesChange = new EventEmitter();
  @Output() selectedOsFamiliesChange = new EventEmitter();
  @Output() selectedGroupsChange = new EventEmitter();
  @Output() queryChange = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() select = new EventEmitter();

  public selectedTemplate: BaseTemplateModel;

  constructor(
    translate: TranslateService,
    authService: AuthService,
  ) {
    super(translate, authService);
  }

  public ngOnInit() {
    this.selectedTemplate = this.preselectedTemplate;
  }

  public onSelectedTemplateChange(template: BaseTemplateModel) {
    this.selectedTemplate = template;
  }

  public isDisableSelectButton() {
    const isTemplateNotSelected = !this.selectedTemplate;
    const isNoTemplatesInCurrentViewMode = !this.templates.length;
    const isSelectedTemplateFromDifferentViewMode = this.selectedTemplate
      && this.selectedTemplate.resourceType.toUpperCase() !== this.viewMode.toUpperCase();
    return isTemplateNotSelected || isNoTemplatesInCurrentViewMode || isSelectedTemplateFromDifferentViewMode;
  }
}
